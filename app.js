const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("express-async-errors");

const mongoose = require("mongoose");

// Routes
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const AIRoutes = require('./routes/AIRoutes')
const projectRoutes = require('./routes/projectRoutes')


const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(
    cors({
        origin: "*",
    })
);

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/nexora", AIRoutes);
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

// connect to database
mongoose
    .connect(process.env.MONGODB_LOCAL_STRING)
    .then(
        app.listen(PORT, () => {
            console.log(
                `DB connected and server is up and running on http://localhost:${PORT}`
            );
        })
    )
    .catch((err) => console.log("Unable to connect to db: ", err.message));

module.exports = app;
