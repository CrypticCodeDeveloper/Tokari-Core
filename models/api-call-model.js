
const {Schema, model} = require("mongoose")

const apiCallSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    apiKey: {
        type: String,
        required: true,
    },
    api_calls: {
        type: Number,
        required: true,
    },
    tokens_used: {
        type: Number,
        required: true,
    },
    tokens_cost: {
        type: Number,
        required: true,
    },
    origin: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    month: {
        type: Number,
        required: true,
    },
    success_calls: {
        type: Number,
        default: 0,
    },
    failed_calls: {
        type: Number,
        default: 0,
    },
}, {timestamps: true});

apiCallSchema.index({
    userId: 1,
    apiKey: 1,
    year: 1,
    month: 1,
}, { unique: true }); 

module.exports = model("ApiCall", apiCallSchema);