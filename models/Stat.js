/* eslint-disable no-undef */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StatSchema = new Schema({
    bings: {
        type: Number,
        default: 0,
        required: false
    }
});

module.exports = Stat = mongoose.model("stats", StatSchema);