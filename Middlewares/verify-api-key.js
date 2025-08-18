
const User = require("../models/user-model")

const VerifyApiKey = async (req, res, next) => {

    const apiKey = req.headers['x-api-key'];

    const user = await User.findOne({ apiKey });
    if (!user) {
        return res.status(403).json({
            message: "Invalid API key",
        });
    }

    next();

}

module.exports = VerifyApiKey;