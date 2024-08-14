const { signIn, signOut } = require("../controllers/user.controller");
const { auth } = require("../middlewares/auth.middleware");

const router = require("express").Router();

router.route("/sign-in").post(signIn);

router.use(auth);
router.route("/sign-out").get(signOut);

module.exports = {
  router,
};
