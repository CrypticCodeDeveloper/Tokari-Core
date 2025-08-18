
const cors = require('cors');

const publicCors = cors({
    origin: '*'
})

const privateCors = cors({
    origin: "http://localhost:5500",
    credentials: true,
})

module.exports = {
    publicCors,
    privateCors
}