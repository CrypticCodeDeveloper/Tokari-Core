const express = require("express");
const userRouter = express.Router();
const authMiddleware = require("../Middlewares/jwtAuthMiddlware");
const { getAllUsers, getUserById, editUserById, deleteUserById } = require("../controllers/usersController");

userRouter.get("/", authMiddleware, getAllUsers);
userRouter.get("/:id", authMiddleware, getUserById);
userRouter.patch('/:id', authMiddleware, editUserById);
userRouter.delete('/:id', authMiddleware, deleteUserById);

module.exports = userRouter;
