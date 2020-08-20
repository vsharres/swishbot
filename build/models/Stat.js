"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var StatSchema = new mongoose_1.Schema({
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
exports.default = mongoose_1.model("stats", StatSchema);
