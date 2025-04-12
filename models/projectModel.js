const mongoose = require('mongoose')
const { Schema } = mongoose

const projectSchema = new Schema({
    name: {
        type: String,
        required: [true, "Project name is required"]
    },
    description: {
        type: String,
        required: [true, "Project description is required"]
    },
    origin: {
        type: String,
        required: [true, "project origin is required"],
    },
    apiKey: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
})

module.exports = mongoose.model('Project', projectSchema)