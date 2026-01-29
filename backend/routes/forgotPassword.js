const express = require('express');
const {findUser,fetchOtp,updatePassword} = require('../controllers/forgotUser.js')
const Router = express.Router()


Router.post('/user/forget/password',findUser)
Router.post('/user/fetch/otp',fetchOtp)
Router.put('/user/reset/password',updatePassword)
module.exports = Router