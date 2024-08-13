const { signIn } = require("../controllers/user.controller");

const router = require("express").Router();

router.route("/sign-in").post(signIn);

module.exports = {
  router,
};
