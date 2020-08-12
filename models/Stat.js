const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StatSchema = new Schema({
    recording_date: {
        type: Date,
        default: Date.now
    },
    head_pupils: [{
        member: {
            type: String
        },
        date: {
            type: Date,
            default: Date.now
        },
    }],
    lightnings: [{
        member: {
            type: String
        },
        question: {
            type: String
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    points: [{
        gryffindor: {
            type: Number
        },
        slytherin: {
            type: Number
        },
        ravenclaw: {
            type: Number
        },
        hufflepuff: {
            type: Number
        }
    }]

});

const Stat = mongoose.model("stats", StatSchema);
module.exports = Stat;