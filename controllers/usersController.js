const User = require("../models/UserModel");

const getAllUsers = async (req, res) => {
    const allUsers = await User.find({});

    res.status(200).json({
        message: "Get all users",
        users: allUsers,
    });
};

const getUserById = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
        return res.status(404).json({
            message: "user not found",
        });
    }

    res.status(200).json({
        message: "get user by id",
        user,
    });
};

const editUserById = async (req, res) => {
    const { id } = req.params;
    const {password} = req.body;
    const isExistingUser = await User.findById(id)

    if (!isExistingUser) {
        return res.status(404).json({
            message: "user not found",
        })
    }

    if (Object.values(req.body).length === 0) {
        return res.status(403).json({
            message: "Edit params missing",
        })
    }

    if (password) {
        return res.status(403).json({
            message: "cannot update user password",
        })
    }

    const updatedUser = await User.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    res.status(200).json({
        message: "updated user successfully",
        user: updatedUser,
    })
}

const deleteUserById = async (req, res) => {
    const {id} = req.params;
    const user = await User.deleteOne({_id: id})
    res.status(200).json({
        message: "deleted user successfully",
        user,
    })
}

module.exports = {
    getAllUsers,
    getUserById,
    editUserById,
    deleteUserById,
};
