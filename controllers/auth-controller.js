const bcrypt = require("bcrypt");
const User = require("../models/user-model");
const jwt = require("jsonwebtoken");
const transporter = require("../utils/node-mailer");
const {v4} = require('uuid')

const generateToken = (payload, secret_key, expiresIn) => {
    return jwt.sign(payload, secret_key, {
        expiresIn
    })
}

const sendVerificationEmail = async (email, verificationToken) => {
    await transporter.sendMail({
                from: "'Tokari Core Team' <crypticcodetechnologies@gmail.com>",
                to: email,
                subject: "Verify your email",
                html: `<h1>Welcome to Tokari</h1>
                       <p>Click the link below to verify your email address:</p>
                       <a href="http://localhost:5500/api/v1/auth/verify?verificationToken=${verificationToken}">Verify Email</a>
                       <p>This link will expire in 10 mins.</p>`
            })
}

const signIn = async (req, res) => {

    const { email, password } = req.body;
    const user = await User.findOne({ email });


    if (!user) {
        return res.status(404).json({
            message: "User with this email does not exist.",
        });
    }

    if (user) {

        const isPasswordCorrect = await bcrypt.compareSync(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(403).json({
                message: "User password is not correct",
            });
        }

        const payload = {
            id: user._id,
            name: user.name,
            email: user.email,
            profile_image: user.profile_image,
            isVerified: user.isVerified,
            apiKey : user.apiKey,
        }

        const refreshToken = generateToken(payload , process.env.JWT_REFRESH_SECRET, '7d');
        

        res.cookie("refreshToken", refreshToken, {
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7
        })

        res.status(200).json({
            message: "User signed in successfully",
            user,
            accessToken: generateToken(payload, process.env.JWT_SECRET_KEY, '15m'),
        });

    }
};

const createUser = async (req, res) => {

    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hashSync(password, 10);

    const isExistingUser = await User.findOne({ email }).select("-password");

    if (!isExistingUser) {

        const verificationToken = generateToken({ email}, process.env.JWT_SECRET_KEY, '10m');

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        })


        await newUser.save();

        try {
            await sendVerificationEmail(email, verificationToken)
        } catch (error) {
            return res.status(500).json({
                message: "Unable to send verification email but user was created. Please login and verify your email later.",
                error,
            })
        }

        
        return res.status(201).json({
            message: "User created successfully, please verify your email",
            user: newUser,
            verificationToken
        });

    }

    // If user already exists
    res.status(409).json({
        message: "User already exists",
        user: isExistingUser,
    });

};

const refreshAcessToken = async (req, res) => {

    const refreshToken = req.cookies['refreshToken']

    if (!refreshToken) return res.status(401).json({
        message: "refresh access token not found.",
    })

    const decodedToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    if (!decodedToken) return res.status(403).json({
        message: "Unauthorized."
    })

    const { id, name, email, profile_image, isVerified, apiKey } = decodedToken

    const accessToken = generateToken({ id, name, email, profile_image, isVerified, apiKey }, process.env.JWT_SECRET_KEY, '15m');

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

const verifyUser = async (req, res) => {
    const { verificationToken } = req.query

    try {
        const { email } = jwt.verify(verificationToken, process.env.JWT_SECRET_KEY)
        const user = await User.findOneAndUpdate({ email }, { isVerified: true }, {
            new: true,
        })

        return res.send(`${user.name}, ${email} has been verified successfully. You can now go back to the tokari core website.`)

    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.send("Verification token has expired. Please request a new verification email.");
        }
    }
}

const resendVerificationEmail = async (req, res) => {
    const {email} = req.body

    const verificationToken = generateToken({email}, process.env.JWT_SECRET_KEY, '10m')
    try {
        await sendVerificationEmail(email, verificationToken)

        return res.status(200).json({
            message: "Verification email sent",
        })
    } catch (error) {
        return res.status(500).json({
            message: "Unable to send email",
            error,
        })
    }
}

const generateApiKey = async (req, res) => {
    
    const { email,isVerified } = req.user;
    const apiKey = `tokari-${v4()}`;

    if (!isVerified) {
        return res.status(500).json({
            message: "Unverified users cannot generate api key"
        })
    }

    try {
        await User.findOneAndUpdate({ email}, { apiKey }, {
        new: true,
    })
    } catch (error) {
        return res.status(500).json({
            message: "Unable to generate API key",
        })
    }

    res.status(201).json({
        message: "API key generated successfully",
        apiKey,
    })

}


module.exports = {
    signIn,
    createUser,
    refreshAcessToken,
    logout,
    verifyUser,
    resendVerificationEmail,
    generateApiKey
};
