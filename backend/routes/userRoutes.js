const express = require('express');
const { registerUser,loginUser,getProfileData,updateProfile,bookAppoinment,listAppoinment,cancelAppoinment,razorpayPayment,verifyPayment,generateInvoicePDF } = require('../controllers/userController');
const authUser = require('../middlewares/authUser');
const upload = require('../middlewares/multer')

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/get-profile',authUser,getProfileData)
userRouter.post('/update-profile',upload.single('image'),authUser,updateProfile);
userRouter.post('/book-appointment',authUser,bookAppoinment)
userRouter.get('/appoinments',authUser,listAppoinment)
userRouter.post('/cancel-appoinment',authUser,cancelAppoinment)
userRouter.post("/payment-razorpay",authUser,razorpayPayment)
userRouter.post('/verifyRazorpay',authUser,verifyPayment)
userRouter.get('/invoice/:appointmentId', generateInvoicePDF);

module.exports = userRouter;