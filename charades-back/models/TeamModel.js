const mongoose = require("mongoose");

const teamSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    icon: {
        type: String,
        default: ""
    },
    points:{
        type: Number,
        default: 0
    },
    active:{
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model("Team", teamSchema);