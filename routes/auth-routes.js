const express = require("express");
const authRouter = express.Router();
const {
  signIn,
  createUser,
  refreshAcessToken,
  logout,
  verifyUser,
  resendVerificationEmail,
  generateApiKey,
} = require("../controllers/auth-controller");
const passport = require("passport");

const { checkSchema, query, body } = require("express-validator");

const {
    signInValidationSchema,
    signUpValidationSchema,
} = require("../validationSchemas/auth-validation-schemas")

const {parseValidationResult} = require("../Middlewares/parse-validation-result")
const authMiddleware = require("../Middlewares/jwtAuthMiddlware");

// Sign user in
authRouter.post("/sign-in", checkSchema(signInValidationSchema),
parseValidationResult,
 signIn);

//  create a new user
authRouter.post("/sign-up", checkSchema(signUpValidationSchema),
parseValidationResult,
createUser);

// Verify user with verification Token
authRouter.get("/verify", query("verificationToken").notEmpty().withMessage("Verification token is required"), 
parseValidationResult ,verifyUser)

// Refresh access token
authRouter.post("/token/refresh", refreshAcessToken);

// logout - clear refresh token from cookies
authRouter.post("/logout", logout);

// resend verfication email
authRouter.post("/resend-verification-email", body("email").notEmpty()
.withMessage("Please pass in email").
isEmail().withMessage("Pass in valid email") ,
parseValidationResult, resendVerificationEmail)

// generate api key
authRouter.get("/generate-api-key", authMiddleware, generateApiKey);

module.exports = authRouter;
