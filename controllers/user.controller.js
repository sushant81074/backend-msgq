const { userRepository } = require("../models/user.redis-om");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { fieldValidator } = require("../utils/fieldValidator");

const User = require("../models/user.model");
const { EntityId } = require("redis-om");
const { createQueue } = require("../queues/producer.queue");
const { createWorker } = require("../workers/process.worker");

const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

const signIn = async (req, res) => {
  try {
    const requestedFields = ({ email, username, password } = req.body);

    const validFields = ["email", "username", "password"];

    const { invalidFields, missingFields } = fieldValidator(
      validFields,
      requestedFields
    );

    // console.log(invalidFields, missingFields);

    if (invalidFields.length || missingFields.length)
      throw new ApiError(
        400,
        `${invalidFields.length ? invalidFields : ""} are required, 
        ${missingFields.length ? missingFields : ""} are required`
      );

    // check & proceed for chache hit

    const emailWithTokenExists = await userRepository
      .search()
      .where("email")
      .equals(email)
      .return.first();

    if (emailWithTokenExists)
      return res
        .cookie("accessToken", emailWithTokenExists["accessToken"])
        .status(200)
        .send(
          new ApiResponse(
            200,
            emailWithTokenExists,
            "user logged-in successfully"
          )
        );

    // else proceed for chache miss

    // check for user exists
    let userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (!userExists) {
      userExists = await User.create({
        email,
        username,
        password,
      });

      if (!userExists) throw new ApiError(500, "unable to sign-in user");
    }

    let accessToken = await userExists.generateAccessToken();

    let usrEntity = await userRepository.save({
      email: userExists.email,
      _id: userExists._id.toHexString(),
      role: userExists.role,
      accessToken,
    });

    await userRepository.expire(usrEntity[EntityId], 60);

    // create a producer and worker queue

    let result = createQueue(userExists._id);
    console.log(result.name, result.qualifiedName);

    result = createWorker(result);
    console.log(result);
    console.log(result.name, result.qualifiedName, "result.id : " + result.id);

    // result.id  532f7111-aa73-47b5-856f-20df76991f88
    // result.id  db944593-eaec-4a03-9703-522a4128831b

    return res
      .cookie("accessToken", accessToken, options)
      .status(200)
      .send(
        new ApiResponse(
          200,
          { email: userExists.email, accessToken },
          "user sign-in successful"
        )
      );
  } catch (error) {
    console.error("error occured", error?.message);

    return res
      .status(error?.statusCode || 500)
      .send(new ApiError(error?.statusCode || 500, error?.message));
  }
};

const signOut = async (req, res) => {
  try {
    if (!req.user || !req.user?._id)
      throw new ApiError(401, "unauthorised user");

    // call for queues to get resolved and destroyed ::::: ========>
    // this is not a good practice as the requests in the queue aren't resolved yet but we'll se about that later

    return res
      .clearCookie("accessToken", options)
      .status(200)
      .send(new ApiResponse(200, {}, "user logged out successfully"));
  } catch (error) {
    console.error("error occured", error?.message);

    return res
      .status(error?.statusCode || 500)
      .send(new ApiError(error?.statusCode || 500, error?.message));
  }
};

module.exports = { signIn, signOut };
