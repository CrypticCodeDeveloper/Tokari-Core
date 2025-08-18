const express = require("express");
const userRouter = express.Router();

const authMiddleware = require("../Middlewares/jwtAuthMiddlware");

const { getAllUsers, getUserById, editUserById, deleteUserById, getCurrentUserDetails } = require("../controllers/user-controller");

// get all users
userRouter.get("/", authMiddleware, getAllUsers);

// get authenticated user details
userRouter.get("/me", authMiddleware, getCurrentUserDetails);
userRouter.patch('/:id', authMiddleware, editUserById);
userRouter.delete('/:id', authMiddleware, deleteUserById);

module.exports = userRouter;
