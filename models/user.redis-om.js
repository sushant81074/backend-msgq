const { Schema, Repository } = require("redis-om");
const { redisClient } = require("../client");

const userSchema = new Schema(
  "User",
  {
    email: { type: "string" },
    _id: { type: "string" },
    role: { type: "string" },
    accessToken: { type: "string" },
  },
  {
    dataStructure: "JSON",
  }
);

const userRepository = new Repository(userSchema, redisClient);
userRepository.createIndex({ _id: userSchema._id });

module.exports = { userRepository };
