
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "crypticcodetechnologies@gmail.com",
        pass: "ulrk vigi lbvo chva",
    }
})

module.exports = transporter;