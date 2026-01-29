const express = require('express');
const { changeAvailablityStatus, doctorsList, loginDoctor,appointmentDoctor,appointmentComplete,appointmentCancel,doctorDashboard,doctorProfile,doctorUpdateProfile,deleteDoctorProfile } = require('../controllers/doctorController.js');
const authDoctor = require('../middlewares/authDoctor.js')
const doctorRouter = express.Router();
const upload = require('../middlewares/multer.js')

doctorRouter.get('/list', doctorsList);
doctorRouter.post('/change-availability', changeAvailablityStatus);
doctorRouter.post('/login', loginDoctor);
doctorRouter.get('/appointments',authDoctor,appointmentDoctor)
doctorRouter.post('/complete-appointment',authDoctor,appointmentComplete)
doctorRouter.post('/cancel-appointment',authDoctor,appointmentCancel)
doctorRouter.get('/dashboard',authDoctor,doctorDashboard)
doctorRouter.get('/profile',authDoctor,doctorProfile)
doctorRouter.post('/update-profile',authDoctor,upload.single('image'),doctorUpdateProfile)
doctorRouter.delete('/delete-profile',authDoctor,deleteDoctorProfile)

module.exports = doctorRouter;
