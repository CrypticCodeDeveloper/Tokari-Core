const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy
const User = require("../models/UserModel")

passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id)
        done(null, user)
    } catch (e) {
        done(e, null)
    }
})

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/v1/auth/google/redirect",
    scope: ["profile", "email"],
}, async (accessToken, refreshToken, profile, done) => {

    let isUserExistingUser;

    try {
        isUserExistingUser = await User.findOne({googleId: profile.id})
        if (isUserExistingUser) {
            return done(null, isUserExistingUser)
        }
    } catch (e) {
        done(e, null);
    }

    if (!isUserExistingUser) {
        try {
            // If user does not exist
            const newGoogleUser = await new User({
                name: profile._json.name,
                email: profile._json.email,
                googleId: profile.id,
                provider: "google",
                profile_image: profile._json.picture,
            }).save()
            return done(null, newGoogleUser)
        } catch (e) {
            return done(e, null);
        }
    }

    console.log("profile: ", profile)
}))