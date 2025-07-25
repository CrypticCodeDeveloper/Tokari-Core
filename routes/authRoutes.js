const express = require("express");
const authRouter = express.Router();
const { signIn, createUser, refreshAcessToken, logout } = require("../controllers/authController");
const passport = require('passport')


authRouter.post("/sign-in", signIn);
authRouter.post("/sign-up", createUser);
authRouter.get('/google', passport.authenticate("google"))
authRouter.get('/google/redirect', passport.authenticate("google"), (req, res) => {
    res.status(200)
})
authRouter.post('/token/refresh', refreshAcessToken)
authRouter.post('/logout', logout)

module.exports = authRouter;
