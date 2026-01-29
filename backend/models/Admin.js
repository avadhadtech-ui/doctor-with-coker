const mongoose = require('mongoose')

const adminSchema = mongoose.Schema({
    email:String,
    password:String,
    otp:String,
    otpExpiresAt:{type:Date}
})

module.exports = mongoose.model('Admin', adminSchema)