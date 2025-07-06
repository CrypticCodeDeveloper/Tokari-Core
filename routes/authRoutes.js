const express = require("express");
const authRouter = express.Router();
const { signIn, createUser, refreshAcessToken } = require("../controllers/authController");
const passport = require('passport')

authRouter.post("/sign-in", signIn);
authRouter.post("/sign-up", createUser);
authRouter.get('/google', passport.authenticate("google"))
authRouter.get('/google/redirect', passport.authenticate("google"), (req, res) => {
    res.status(200)
})
authRouter.post('/token/refresh', refreshAcessToken)

module.exports = authRouter;
