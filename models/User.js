/* eslint-disable no-undef */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    _id: {
        type:Number,
        required:true
    },
    patronus: {
        type: String,
        required: false
    }

}, {_id:false});

module.exports = User = mongoose.model("users", UserSchema);
