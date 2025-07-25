const bcrypt = require("bcrypt");
const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET_KEY, {
        expiresIn: '15m'
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
            profile_image: user.profile_image,
        }

        const refreshToken = jwt.sign(
            payload,
            process.env.JWT_REFRESH_SECRET
        );

        res.cookie("refreshToken", refreshToken, {
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7
        })

        const token = generateAccessToken(payload);

        res.status(200).json({
            message: "user signed in successfully",
            user,
            accessToken: token,
        });

    }
};

const createUser = async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hashSync(password, 10);

    // Check if user exists
    const isExistingUser = await User.findOne({ email }).select("-password");

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
    const refreshToken = req.cookies['refreshToken']


    if (!refreshToken) return res.status(401).json({
        message: "refresh access token not found.",
    })

    const decodedToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '15m'
    });

    if (!decodedToken) return res.status(403).json({
        message: "Unauthorized."
    })

    const {id, name, email, profile_image} = decodedToken

    const accessToken = generateAccessToken({id, name, email, profile_image});

    res.status(200).json({
        accessToken
    })
}

const logout = async (req, res) => {
    res.clearCookie("refreshToken", {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
    });

    res.status(200).json({
        message: "user logged out successfully",
    });
}


module.exports = {
    signIn,
    createUser,
    refreshAcessToken,
    logout,
};
