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
    status: {
        type: String,
        default: "active",
        enum: ["active", "in-active"]
    },
    model: {
        type: String,
        default: "gpt-3.5-turbo"
    },
    origin: {
        type: String,
        required: [true, "project origin is required"],
    },
    requests: {
        type: Number,
        default: 0,
    },
    tokens: {
        type: Number,
        default: 20000,
    },
    token_used: {
        type: Number,
        default: 0,
    },
    last_used: {
        type: Date,
        default: "",
    },
    api_key: {
        type: String,
        required: true,
        unique: true,
    },
    monthly_cost: {
        type: Number,
        default: 0
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, {timestamps: true});

module.exports = mongoose.model('Project', projectSchema)