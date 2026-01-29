const doctorModel = require('../models/DoctorModel.js');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const appoinmentModel = require('../models/AppoinmentModel')
const userModel = require('../models/UserModel')
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin.js')
const createAdminIfNoExists = async () =>{
  const existAdmin = await Admin.findOne({email:"avadhgolakiya88@gmail.com"})
  const password = "avadh@admin@password"
  const hashedPassword = await bcrypt.hash(password,10)
  if(!existAdmin){
    await Admin.create({
        email:"avadhgolakiya88@gmail.com",
        password:hashedPassword
    })
    return true; 
  }
}

const createAdmin = async (req,res) =>{
  try {
    const created = await createAdminIfNoExists();
    if(created){
        return res.json({ success: true, message: "Admin created" });
    } else {
        return res.json({ success: false, message: "Admin already exists" });
    }
} catch(err) {
    return res.status(500).json({ success: false, message: err.message });
}
}


const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const getLoginData = await Admin.findOne({ email });

    if (!getLoginData) {
      return res.json({ success: false, message: 'Invalid credentials' });
    }


    const isMatch = await bcrypt.compare(password, getLoginData.password);
    if (isMatch) {
      const token = jwt.sign(
        { email: getLoginData.email },  
        process.env.JWT_SECRET,
        { expiresIn: '1h' }  
      );
      return res.json({ success: true, token });
    } else {
      return res.json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};


const addDoctor = async (req, res) => {
  try {
    const { name, email, password, experience, fees, about, speciality, degree, address } = req.body;

    let imageUrl = '';
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, { folder: 'doctors' });
      imageUrl = uploadResult.secure_url;
    }

    let parsedAddress = {};
    try {
      parsedAddress = JSON.parse(address);
    } catch {
      parsedAddress = {};
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword  = await bcrypt.hash(password,salt)
    const newDoctor = new doctorModel({
      name,
      email,
      password:hashedPassword,
      image: imageUrl,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: parsedAddress,
      date: Date.now(),
    });

    await newDoctor.save();
    res.json({ success: true, message: 'Doctor added successfully' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    res.json({ success: true, doctors });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
const getAppoinmentAdmin = async (req,res) =>{
  try {
    const appoinments = await appoinmentModel.find({})
    res.json({success:true,appoinments})

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
}
const appointmentCancel = async (req, res) => {
  try {
    const { appoinmentId } = req.body;

    const appointmentData = await appoinmentModel.findById(appoinmentId)
    await appoinmentModel.findByIdAndUpdate(appoinmentId,{cancelled:true})


    // Release doctor's slot
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);
    let slotsBooked = doctorData.slotsBooked || {};

    if (slotsBooked[slotDate]) {
      slotsBooked[slotDate] = slotsBooked[slotDate].filter((e) => e !== slotTime);
      await doctorModel.findByIdAndUpdate(docId, { slotsBooked });
    }

    return res.json({ success: true, message: "Appointment Cancelled" });

  } catch (error) {
    console.error("Cancel Appointment Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const adminDashboard = async (req,res) =>{
  try {
    const doctor = await doctorModel.find({})
    const users = await userModel.find({})
    const appoinment = await appoinmentModel.find({})
    const dashData = {
      doctors:doctor.length,
      appoinment:appoinment.length,
      patient:users.length,
      latestAppoinment:appoinment.reverse().slice(0,5)
    }
    res.json({success:true,dashData})
  } catch (error) {
    console.error("Cancel Appointment Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
module.exports = {createAdminIfNoExists,createAdmin, adminLogin, addDoctor, getAllDoctors,getAppoinmentAdmin,appointmentCancel,adminDashboard };
