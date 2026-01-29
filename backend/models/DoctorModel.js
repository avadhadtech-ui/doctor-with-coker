const mongoose = require('mongoose')

const doctorsSchema = new mongoose.Schema({
            name:{type:String, required:true},
            email:{type:String, required:true,unique:true},
            password:{type:String, required:true},
            image:{type:String,default:false},
            speciality:{type:String, required:true},
            degree:{type:String, required:true},
            experience:{type:String, required:true},
            about:{type:String, required:true},
            available:{type:Boolean, default:true},
            fees:{type:Number, required:true},
            address:{type:Object, required:true},
            date:{type:Number, required:true},
            slotsBooked:{type:Object,default:{}},          
            otp:String,
            otpExpiresAt:{type:Date}
},{minimize:false}) // used minimize false beacuse of use empty object if it is true we can't create doctor data with empty object

const doctorModel = mongoose.models.doctor || mongoose.model('doctor', doctorsSchema);

module.exports = doctorModel