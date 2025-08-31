const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/asyncWrap.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");

router
  .route("/login")
  .get(userController.loginPage)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    userController.loggedIn
  );

router.route("/signup").get(userController.signupPage).post(
  wrapAsync(userController.signup) // Using the signup controller function
);

router.get("/logout", userController.logout);

module.exports = router;

