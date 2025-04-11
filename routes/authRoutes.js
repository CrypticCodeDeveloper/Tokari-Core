const express = require("express");
const authRouter = express.Router();
const { signIn, createUser } = require("../controllers/authController");

authRouter.post("/sign-in", signIn);
authRouter.post("/sign-up", createUser);

module.exports = authRouter;
