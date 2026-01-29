const doctorModel = require("../models/DoctorModel");
const appoinemt = require('../models/AppoinmentModel.js')
const bcrypt  = require('bcrypt')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2;
const changeAvailablityStatus = async (req, res) => {
    try {
        const { docId } = req.body;

        const doctorData = await doctorModel.findById(docId);
        if (!doctorData) {
            return res.json({ success: false, message: 'Doctor not found' });
        }

        await doctorModel.findByIdAndUpdate(docId, { available: !doctorData.available });

        res.json({ success: true, message: "Changed Available Status" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

const doctorsList = async (req, res) => {
    try {
        
        const doctors = await doctorModel.find({}).select('-password -email');

        res.json({ success: true, doctors });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

const loginDoctor = async (req,res) =>{
            try {
                const {email,password} =req.body
                console.log("Login attempt:", email, password);
                const doctor = await doctorModel.findOne({email})
              
                if(!doctor){
                    return res.json({success:false,message:"Did not find any doctor with this email id"})
                }
                const isMatch = await bcrypt.compare(password, doctor.password)
                if(isMatch){
                    const token =  jwt.sign({id:doctor._id}, process.env.JWT_SECRET)
                    res.json({success:true,token})
                }else{
                    res.json({success:false,message:"Invalid credentials"})
                }
            } catch (error) {
                console.error("Login error:", error);
                res.json({ success: false, message: error.message });
            }
}
const appointmentDoctor = async(req, res) => {
    try {
      const doctorId = req.docId;
      const appointments = await appoinemt.find({ docId: doctorId })
      res.json({ success: true, appointments });
    } catch (error) {
      console.error("Appointment fetch error:", error);
      res.json({ success: false, message: error.message });
    }
  }
  
  const appointmentComplete = async (req, res) => {
    try {
      const doctorId = req.docId;
      const { appoinmentId } = req.body;
  
      const appointmentData = await appoinemt.findById(appoinmentId);
  
      if (appointmentData && appointmentData.docId.toString() === doctorId) {
        await appoinemt.findByIdAndUpdate(appoinmentId, { isCompleted: true }, { new: true });
        res.json({ success: true, message: "Appointment completed" });
      } else {
        res.json({ success: false, message: "Marked failed. Unauthorized or not found." });
      }
    } catch (error) {
      console.error("Complete appointment error:", error);
      res.json({ success: false, message: error.message });
    }
  };
  
  const appointmentCancel = async (req, res) => {
    try {
      const doctorId = req.docId;
      const { appoinmentId } = req.body;
  
      const appointmentData = await appoinemt.findById(appoinmentId);
  
      if (appointmentData && appointmentData.docId.toString() === doctorId) {
        await appoinemt.findByIdAndUpdate(appoinmentId, { cancelled: true }, { new: true });
        res.json({ success: true, message: "Appointment cancelled" });
      } else {
        res.json({ success: false, message: "Cancellation failed. Unauthorized or not found." });
      }
    } catch (error) {
      console.error("Cancel appointment error:", error);
      res.json({ success: false, message: error.message });
    }
  };

  const doctorDashboard = async (req,res) =>{
    try {
      const docId = req.docId; 
      console.log(docId)
      const appointments = await appoinemt.find({docId})

      let earnings = 0

      appointments.map((item)=>{
        if(item.isCompleted || item.payment){
              earnings += item.amount
        }
      })
      let patients = []
      appointments.map((item)=>{
        if(!patients.includes(item.userId)){
            patients.push(item.userId)
        }
      })
      const dashData = {
        earnings,
        appointments:appointments.length,
        patients:patients.length,
        latestAppointments:appointments.reverse().slice(0,5)
      }
      res.json({success:true,dashData})
    } catch (error) {
      console.error("Cancel appointment error:", error);
      res.json({ success: false, message: error.message });
    }
  }


  const doctorProfile = async (req,res) =>{
    try {
      const docId = req.docId; 
      const profileData = await doctorModel.findById(docId).select('-password')
      res.json({success:true,data:profileData})
    } catch (error) {
      console.error("Cancel appointment error:", error);
      res.json({ success: false, message: error.message });
    }
  }

const doctorUpdateProfile = async (req, res) => {
  try {
    let imageUrl = null;
    
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, { folder: 'doctors' });
      imageUrl = uploadResult.secure_url;
    }
    
    const docId = req.docId; 
    const { fees, available, experience,} = req.body;

    
    const updateData = { fees, available, experience };
    
    if (imageUrl) {
      updateData.image = imageUrl;
    }
  
    await doctorModel.findByIdAndUpdate(docId, updateData, { new: true });
    
    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.error("Update profile error:", error);
    res.json({ success: false, message: error.message });
  }
}

const deleteDoctorProfile = async (req,res) =>{
  try {
    const docId = req.docId
    const deletDoctor = await doctorModel.findByIdAndDelete(docId)
    res.json({success:true,message:"Your profile has been deleted successfully"})
  } catch (error) {
    console.error("Update profile error:", error);
    res.json({ success: false, message: error.message });
  }
 
}

module.exports = { changeAvailablityStatus, doctorsList,loginDoctor,appointmentDoctor,appointmentComplete,appointmentCancel,doctorDashboard,doctorProfile,doctorUpdateProfile,deleteDoctorProfile };
