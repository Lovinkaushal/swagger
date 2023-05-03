const { number } = require("joi");
const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        minlength: 6,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    referredby:{
        type:String,
        required:true
    },
    level:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:false,
        default:""
    }
});
module.exports = mongoose.model('users', userSchema);