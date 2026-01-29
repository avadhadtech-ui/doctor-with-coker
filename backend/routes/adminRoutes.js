const express = require('express');
const { addDoctor, adminLogin, getAllDoctors,getAppoinmentAdmin,appointmentCancel,adminDashboard } = require('../controllers/adminController.js');
const upload = require('../middlewares/multer.js');
const authAdmin = require('../middlewares/authAdmin.js');
const { changeAvailablityStatus } = require('../controllers/doctorController.js');

const adminRouter = express.Router();

adminRouter.post('/add-doctor', authAdmin, upload.single('image'), addDoctor);
adminRouter.post('/login', adminLogin);
adminRouter.post('/all-doctors', authAdmin, getAllDoctors);
adminRouter.post('/change-availability', authAdmin, changeAvailablityStatus);
adminRouter.get('/appoinments',authAdmin,getAppoinmentAdmin) 
adminRouter.post('/cancel-appoinment',authAdmin,appointmentCancel)
adminRouter.get('/dashboard',authAdmin,adminDashboard)
module.exports = adminRouter;
