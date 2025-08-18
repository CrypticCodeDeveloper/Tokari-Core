
const {validationResult} = require("express-validator")

const parseValidationResult = (req, res, next) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Validation failed",
            error: errors.array(),
        })
    }

    next()

}

module.exports = {
    parseValidationResult
}