const express = require('express');
const {sendOTP,fetchOtp,resetPassword} = require('../controllers/forgotAdmin.js')
const Router = express.Router()


Router.post('/admin/forget/password',sendOTP)
Router.post('/admin/verify-otp',fetchOtp)
Router.put('/admin/reset/password', resetPassword)
module.exports = Router