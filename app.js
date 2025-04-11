var createError = require("http-errors");
var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require('./routes/aiRoutes')
const dotenv = require("dotenv");
const cors = require("cors");
require("express-async-errors");
dotenv.config();

var app = express();

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
app.use("/api/v1/nexora", aiRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error message
    res.status(err.status || 500).json({
        Error: err.name,
        message: err.message,
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
