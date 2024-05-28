const mongoose = require("mongoose");

const wordSchema = mongoose.Schema({
    word: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    active:{
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model("Word", wordSchema);