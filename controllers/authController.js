const bcrypt = require("bcrypt");
const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET_KEY, {
        expiresIn: '3d'
    })
}

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

        const payload = {
            id: user._id,
            name: user.name,
            email: user.email,
        }

        const refreshToken = jwt.sign(
            payload,
            process.env.JWT_REFRESH_SECRET,
            {
                expiresIn: "3d",
            }
        );

        res.cookie("refreshToken", refreshToken, {
            secure: true,
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7
        })

        const token = generateAccessToken(payload);

        res.status(200).json({
            message: "user signed in successfully",
            user,
            accessToken: token,
            refreshToken
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

const refreshAcessToken = async (req, res) => {
    const {refreshToken} = req.body


    if (!refreshToken) return res.status(401).json({
        message: "refresh access token not found.",
    })

    const verifiedToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '15m'
    });

    if (!verifiedToken) return res.status(403).json({
        message: "Unauthorized."
    })

    const {id, name, email} = verifiedToken

    const accessToken = generateAccessToken({id, name, email});

    res.status(200).json({
        accessToken
    })
}

module.exports = {
    signIn,
    createUser,
    refreshAcessToken,
};
