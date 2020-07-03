/* eslint-disable no-undef */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StatSchema = new Schema({
    recording_date: {
        type:Date,
        default:Date.now
    },
    binger: {
        type:String
    },
    bings: {
        type: Number,
        default: 0
    },
    lightnings:[{
        member: {
            type:String
        },
        question: {
            type:String
        },
        date: {
            type: Date,
            default:Date.now
        }
    }]

});

module.exports = Stat = mongoose.model("stats", StatSchema);