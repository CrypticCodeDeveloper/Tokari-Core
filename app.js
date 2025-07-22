const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("express-async-errors");

const app = express();

const mongoose = require("mongoose");
const session = require('express-session')
const passport = require("passport")

const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

app.use(
    cors({
        origin: "https://tokari-core.vercel.app",
        credentials: true,
    })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

// Routes
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const AIRoutes = require('./routes/AIRoutes')
const projectRoutes = require('./routes/projectRoutes')


app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
}))

app.use(passport.initialize());
app.use(passport.session())


// Routes
app.get("/" , (req, res) => {
    res.send("Tokari Core - Plug AI into your app in minutes.")
})

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/chat-completions", AIRoutes);
app.use("/api/v1/projects", projectRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    const statusCode = err.status || 500;

    if (req.app.get("env") === "development") {
        console.error(err.stack);
    }

    res.status(statusCode).json({
        error: err.name || "InternalServerError",
        message: err.message,
        ...(req.app.get("env") === "development" && { stack: err.stack }),
    });
});

// Start Server
const PORT = process.env.PORT || 5500;

let connectionString;

if (process.env.NODE_ENV === "production") {
    connectionString = process.env.MONGODB_URI;
} else if (process.env.NODE_ENV === "development") {
    connectionString = process.env.MONGODB_LOCAL_STRING;
}

console.log(connectionString)

// connect to database
mongoose
    .connect(connectionString)
    .then(
        () => {
            app.listen(PORT, () => {
            console.log(
                `DB connected and server is up and running on port ${PORT}`
            );
        })
        }
    )
    .catch((err) => console.log("Unable to connect to db: ", err.message));

module.exports = app;
