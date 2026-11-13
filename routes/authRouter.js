//routes/authRouter.js//

const { Router } = require("express");
const passport = require("passport");
const authController = require("../controllers/authController");

const authRouter = Router();

// Sign Up Routes
authRouter.get("/sign-up", authController.getSignUp);
authRouter.post("/sign-up", authController.postSignUp);

// Log in Routes
authRouter.get("/log-in", authController.getLogin);
authRouter.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/log-in?error=Invalid+username+or+password",
  })
);

// Log out Route
authRouter.get("/log-out", authController.logoutUser);

module.exports = authRouter;