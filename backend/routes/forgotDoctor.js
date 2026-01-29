const express = require('express');
const {sendOTP, fetchOtp, resetPassword} = require('../controllers/forgotDoctor.js')
const Router = express.Router()

Router.post('/doctor/forget/password', sendOTP)
Router.post('/doctor/verify-otp', fetchOtp)
Router.put('/doctor/reset/password', resetPassword)

module.exports = Router