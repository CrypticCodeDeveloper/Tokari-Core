const mongoose = require("mongoose");
const {profilePictures} = require("../constants/indexConstants")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"],
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [function () {
            return this.provider === "local"
        }, "input a password"],
    },
    googleId: {
        type: String,
        required: [function () {
            return this.provider === "google"
        }, "googleId is required for google authenticated users"]
    },
    provider: {
        type: String,
        enum: ["local", "google"],
        default: "local",
        required: true,
    },
    profile_image : {
        type: String,
        default: function () {
            const profileIndex = Math.floor((Math.random() * profilePictures.length))
            return profilePictures[profileIndex]
        },
        required: [true, "profile picture is required"]
    }
}, {timestamps: true});

module.exports = mongoose.model("User", userSchema);
