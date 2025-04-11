const bcrypt = require("bcrypt");
const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");

const signIn = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // If user is not found
    if (!user) {
        return res.status(404).json({
            message: "user with this email does not exist.",
        });
    }

    // If user is found
    if (user) {
        // Check if user password is correct
        const isPasswordCorrect = await bcrypt.compareSync(
            password,
            user?.password
        );
        if (!isPasswordCorrect) {
            return res.status(403).json({
                message: "user password is not correct",
            });
        }

        // If user password is correct
        const token = jwt.sign(
            {
                name: user.name,
                email: user.email,
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "3d",
            }
        );
        res.status(200).json({
            message: "user signed in successfully",
            user,
            token,
        });
    }
};

const createUser = async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hashSync(password, 10);

    // Check if user exists
    const isExistingUser = await User.findOne({ email });

    if (!isExistingUser) {
        // create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });
        await newUser.save();
        return res.status(201).json({
            message: "new user created",
            user: newUser,
        });
    }

    // If user exists
    res.status(409).json({
        message: "user already exists",
        user: isExistingUser,
    });
};

module.exports = {
    signIn,
    createUser,
};
