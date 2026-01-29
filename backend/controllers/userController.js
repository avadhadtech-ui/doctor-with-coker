const validator = require('validator');
const bcrypt = require('bcrypt');
const userModel = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary');
const doctorModel = require('../models/DoctorModel')
const appoinmentModel = require('../models/AppoinmentModel')
const razorpay = require('razorpay')
const crypto = require("crypto");
const nodemailer = require("nodemailer")
const PDFDocument = require('pdfkit');
const fs = require('fs');
const SVGtoPDF = require('svg-to-pdfkit');
const axios = require('axios');

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing details" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter valid email" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Enter strong password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = { name, email, password: hashedPassword };
    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "avadhgolakiya88@gmail.com",
        pass: "zvtpdprzfebryjfe", 
      },
    })
    
    const mailOptions = {
      from: "avadhgolakiya88@gmail.com",
      to: email,
      subject: "🎉 Welcome to Prescripto - Your Healthcare Journey Begins!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          
          <table width="100%" cellpadding="0" cellspacing="0" style="min-height: 100vh; padding: 40px 20px;">
            <tr>
              <td align="center">
                
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 650px; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);">
                  
                  <!-- Header Wave Design -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #5f6fff 0%, #7c8fff 50%, #9ca8ff 100%); padding: 0; position: relative; height: 200px;">
                      <table width="100%" cellpadding="0" cellspacing="0" style="height: 200px;">
                        <tr>
                          <td align="center" valign="middle">
                            <!-- Brand Logo/Name -->
                            <div style="background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); border-radius: 20px; padding: 15px 35px; display: inline-block; border: 2px solid rgba(255, 255, 255, 0.3);">
                              <h1 style="margin: 0; color: #ffffff; font-size: 36px; font-weight: 800; letter-spacing: 1px; text-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                                💊 Prescripto
                              </h1>
                            </div>
                          </td>
                        </tr>
                      </table>
                      <!-- Wave SVG Bottom -->
                      <div style="position: absolute; bottom: -1px; left: 0; width: 100%;">
                        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style="display: block; width: 100%; height: 60px;">
                          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#ffffff"></path>
                        </svg>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 20px 50px 40px 50px;">
                      
                      <!-- Welcome Icon -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 25px;">
                    <tr>
                      <td align="center">
                        <div style="width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(135deg, #5f6fff 0%, #8b9fff 100%); display: inline-block; text-align: center; line-height: 100px; box-shadow: 0 8px 25px rgba(95, 111, 255, 0.3);">
                          <span style="font-size: 50px; vertical-align: middle;">🎉</span>
                        </div>
                      </td>
                    </tr>
                  </table>
                      
                      <!-- Welcome Greeting -->
                      <h2 style="margin: 0 0 10px 0; color: #1a202c; font-size: 32px; font-weight: 700; text-align: center;">
                        Welcome to Prescripto!
                      </h2>
                      
                      <p style="margin: 0 0 30px 0; color: #718096; font-size: 16px; line-height: 1.6; text-align: center;">
                        Hi <strong style="color: #5f6fff;">${name || 'There'}</strong>! 👋
                      </p>
                      
                      <p style="margin: 0 0 35px 0; color: #4a5568; font-size: 15px; line-height: 1.8; text-align: center;">
                        We're thrilled to have you join our healthcare community! Your account has been successfully created, and you're now part of a platform dedicated to making healthcare accessible and convenient.
                      </p>
                      
                      <!-- Features Section -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                        <tr>
                          <td>
                            <div style="background: linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%); border-radius: 16px; padding: 25px; margin-bottom: 15px;">
                              <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td width="60" valign="top">
                                    <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); border-radius: 12px; text-align: center; line-height: 50px;">
                                      <span style="font-size: 28px;">🩺</span>
                                    </div>
                                  </td>
                                  <td valign="middle" style="padding-left: 15px;">
                                    <p style="margin: 0 0 5px 0; color: #22543d; font-size: 16px; font-weight: 700;">
                                      Book Appointments
                                    </p>
                                    <p style="margin: 0; color: #2f855a; font-size: 14px; line-height: 1.5;">
                                      Schedule appointments with top healthcare professionals at your convenience.
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </div>
                            
                            <div style="background: linear-gradient(135deg, #ebf8ff 0%, #bee3f8 100%); border-radius: 16px; padding: 25px; margin-bottom: 15px;">
                              <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td width="60" valign="top">
                                    <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%); border-radius: 12px; text-align: center; line-height: 50px;">
                                      <span style="font-size: 28px;">📋</span>
                                    </div>
                                  </td>
                                  <td valign="middle" style="padding-left: 15px;">
                                    <p style="margin: 0 0 5px 0; color: #2c5282; font-size: 16px; font-weight: 700;">
                                      Digital Prescriptions
                                    </p>
                                    <p style="margin: 0; color: #2b6cb0; font-size: 14px; line-height: 1.5;">
                                      Access your prescriptions digitally anytime, anywhere with ease.
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </div>
                            
                            <div style="background: linear-gradient(135deg, #fef5e7 0%, #fdeab3 100%); border-radius: 16px; padding: 25px;">
                              <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td width="60" valign="top">
                                    <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #f6ad55 0%, #ed8936 100%); border-radius: 12px; text-align: center; line-height: 50px;">
                                      <span style="font-size: 28px;">🔔</span>
                                    </div>
                                  </td>
                                  <td valign="middle" style="padding-left: 15px;">
                                    <p style="margin: 0 0 5px 0; color: #7c2d12; font-size: 16px; font-weight: 700;">
                                      Health Reminders
                                    </p>
                                    <p style="margin: 0; color: #9c4221; font-size: 14px; line-height: 1.5;">
                                      Never miss a dose with smart medication and appointment reminders.
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Call to Action Button -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                        <tr>
                          <td align="center">
                            <a href="#" style="display: inline-block; background: linear-gradient(135deg, #5f6fff 0%, #8b9fff 100%); color: #ffffff; text-decoration: none; padding: 16px 50px; border-radius: 50px; font-size: 16px; font-weight: 700; box-shadow: 0 8px 25px rgba(95, 111, 255, 0.4); transition: transform 0.3s;">
                              Get Started Now 🚀
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Security Note -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td>
                            <div style="background: linear-gradient(135deg, #ebf4ff 0%, #c3dafe 100%); border-left: 5px solid #4299e1; border-radius: 12px; padding: 18px 25px;">
                              <p style="margin: 0; color: #2c5282; font-size: 14px; line-height: 1.7;">
                                🔒 <strong>Your Privacy Matters:</strong> We take your health data security seriously. Your information is encrypted and will never be shared without your explicit consent.
                              </p>
                            </div>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 30px 0 0 0; color: #718096; font-size: 14px; line-height: 1.7; text-align: center;">
                        Need help getting started? Visit our <a href="#" style="color: #5f6fff; text-decoration: none; font-weight: 600;">Help Center</a> or contact our support team anytime!
                      </p>
                      
                    </td>
                  </tr>
                  
                  <!-- Divider -->
                  <tr>
                    <td style="padding: 0 50px;">
                      <div style="height: 2px; background: linear-gradient(90deg, transparent 0%, #e2e8f0 20%, #cbd5e0 50%, #e2e8f0 80%, transparent 100%);"></div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); padding: 40px 50px; text-align: center;">
                      
                      <!-- Social Links -->
                      <table cellpadding="0" cellspacing="0" style="margin: 0 auto 25px auto;">
                        <tr>
                          <td>
                            <a href="#" style="display: inline-block; width: 40px; height: 40px; background: #5f6fff; border-radius: 50%; text-align: center; line-height: 40px; color: #ffffff; text-decoration: none; margin: 0 8px; font-size: 18px; transition: transform 0.3s;">📧</a>
                          </td>
                          <td>
                            <a href="#" style="display: inline-block; width: 40px; height: 40px; background: #5f6fff; border-radius: 50%; text-align: center; line-height: 40px; color: #ffffff; text-decoration: none; margin: 0 8px; font-size: 18px;">🌐</a>
                          </td>
                          <td>
                            <a href="#" style="display: inline-block; width: 40px; height: 40px; background: #5f6fff; border-radius: 50%; text-align: center; line-height: 40px; color: #ffffff; text-decoration: none; margin: 0 8px; font-size: 18px;">📱</a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 0 0 10px 0; color: #4a5568; font-size: 15px; font-weight: 600;">
                        Prescripto - Your Health, Our Priority
                      </p>
                      
                      <p style="margin: 0 0 20px 0; color: #718096; font-size: 13px; line-height: 1.6;">
                        Making healthcare accessible and convenient for everyone.
                      </p>
                      
                      <div style="margin-bottom: 20px;">
                        <a href="#" style="color: #5f6fff; text-decoration: none; font-size: 13px; margin: 0 12px; font-weight: 500;">Help Center</a>
                        <span style="color: #cbd5e0;">•</span>
                        <a href="#" style="color: #5f6fff; text-decoration: none; font-size: 13px; margin: 0 12px; font-weight: 500;">Privacy Policy</a>
                        <span style="color: #cbd5e0;">•</span>
                        <a href="#" style="color: #5f6fff; text-decoration: none; font-size: 13px; margin: 0 12px; font-weight: 500;">Terms of Service</a>
                      </div>
                      
                      <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                        © ${new Date().getFullYear()} Prescripto. All rights reserved.
                      </p>
                      
                      <p style="margin: 10px 0 0 0; color: #cbd5e0; font-size: 11px; font-style: italic;">
                        This is an automated welcome notification. Please do not reply to this email.
                      </p>
                      
                    </td>
                  </tr>
                  
                </table>
                
              </td>
            </tr>
          </table>
          
        </body>
        </html>
      `,
    }
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email sending failed:", error)
        return res.json({ success: false, message: "Failed to send welcome email." })
      } else {
        return res.json({
          success: true,
          message: `Welcome email sent to ${email}`,
        })
      }
    })
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (isMatched) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      return res.json({ success: false, message: "Invalid credentials" });
    }

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};


const getProfileData = async (req, res) => {
  try {
    const userId = req.userId;
    const userData = await userModel.findById(userId).select('-password');

    res.json({ success: true, userData });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};


const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !address || !dob || !gender) {
      return res.json({ success: false, message: 'Data missing' });
    }

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    });


    if (imageFile) {
      const uploadResponse = await cloudinary.v2.uploader.upload(imageFile.path, {
        resource_type: 'image',
      });

      const imageUrl = uploadResponse.secure_url;
      await userModel.findByIdAndUpdate(userId, { image: imageUrl });
    }

    res.json({ success: true, message: "Profile has been updated" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
// Api to book appoinment

const bookAppoinment = async(req,res) =>{
  try {
        const { docId, slotTime, slotDate } = req.body;
        const userId = req.userId;
        const doctorData = await doctorModel.findById(docId).select('-password')

        if(!doctorData.available){
            return res.json({success:false,message:"Doctor not available"})
        }

        let slotsBooked = doctorData.slotsBooked || {};

        //Checking for slot availability
        if(slotsBooked[slotDate]){
          if(slotsBooked[slotDate].includes(slotTime)){
            return res.json({success:false,message:"Slot not available"})
          }else{
            slotsBooked[slotDate].push(slotTime)
          }
        }else{
          slotsBooked[slotDate] = []
          slotsBooked[slotDate].push(slotTime)
        }
        const userData = await userModel.findById(userId).select('-password')

        delete doctorData.slotsBooked; 

        const appoinmentData = {
          userId,
          docId,
          userData,
          doctorData: doctorData.toObject(),
          amount:doctorData.fees,
          slotTime: slotTime, 
          slotDate,
          date: Date.now()
        }
        const newAppoinment = new appoinmentModel(appoinmentData)
        await newAppoinment.save()

        await doctorModel.findByIdAndUpdate(docId,{slotsBooked})
        
        const [day, month, year] = slotDate.split('_');
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const formattedDate = `${day} ${monthNames[parseInt(month) - 1]} ${year}`;
        
        // Send appointment confirmation email
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "avadhgolakiya88@gmail.com",
            pass: "zvtpdprzfebryjfe", 
          },
        })
        
        
        const mailOptions = {
          from: "avadhgolakiya88@gmail.com",
          to: userData.email,
          subject: "✅ Appointment Confirmed - Prescripto",
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
              
              <table width="100%" cellpadding="0" cellspacing="0" style="min-height: 100vh; padding: 40px 20px;">
                <tr>
                  <td align="center">
                    
                    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 650px; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);">
                      
                      <!-- Header Wave Design -->
                      <tr>
                        <td style="background: linear-gradient(135deg, #48bb78 0%, #38a169 50%, #2f855a 100%); padding: 0; position: relative; height: 200px;">
                          <table width="100%" cellpadding="0" cellspacing="0" style="height: 200px;">
                            <tr>
                              <td align="center" valign="middle">
                                <!-- Brand Logo/Name -->
                                <div style="background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); border-radius: 20px; padding: 15px 35px; display: inline-block; border: 2px solid rgba(255, 255, 255, 0.3);">
                                  <h1 style="margin: 0; color: #ffffff; font-size: 36px; font-weight: 800; letter-spacing: 1px; text-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                                    💊 Prescripto
                                  </h1>
                                </div>
                              </td>
                            </tr>
                          </table>
                          <!-- Wave SVG Bottom -->
                          <div style="position: absolute; bottom: -1px; left: 0; width: 100%;">
                            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style="display: block; width: 100%; height: 60px;">
                              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#ffffff"></path>
                            </svg>
                          </div>
                        </td>
                      </tr>
                      
                      <!-- Main Content -->
                      <tr>
                        <td style="padding: 20px 50px 40px 50px;">
                          
                          <!-- Success Icon -->
                          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 25px;">
                            <tr>
                              <td align="center">
                                <div style="width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); display: inline-block; text-align: center; line-height: 100px; box-shadow: 0 8px 25px rgba(72, 187, 120, 0.4);">
                                  <span style="font-size: 50px; vertical-align: middle;">✅</span>
                                </div>
                              </td>
                            </tr>
                          </table>
                          
                          <!-- Confirmation Heading -->
                          <h2 style="margin: 0 0 10px 0; color: #1a202c; font-size: 32px; font-weight: 700; text-align: center;">
                            Appointment Confirmed!
                          </h2>
                          
                          <p style="margin: 0 0 30px 0; color: #718096; font-size: 16px; line-height: 1.6; text-align: center;">
                            Hi <strong style="color: #48bb78;">${userData.name}</strong>! 👋
                          </p>
                          
                          <p style="margin: 0 0 35px 0; color: #4a5568; font-size: 15px; line-height: 1.8; text-align: center;">
                            Your appointment has been successfully booked. We look forward to providing you with quality healthcare service.
                          </p>
                          
                          <!-- Appointment Details Card -->
                          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                            <tr>
                              <td>
                                <div style="background: linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%); border-radius: 20px; padding: 30px; border: 3px solid #48bb78;">
                                  
                                  <!-- Doctor Info -->
                                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 25px;">
                                    <tr>
                                      <td align="center">
                                        ${doctorData.image ? `
                                        <div style="width: 80px; height: 80px; border-radius: 50%; overflow: hidden; border: 4px solid #48bb78; box-shadow: 0 6px 20px rgba(72, 187, 120, 0.3); display: inline-block; margin-bottom: 15px;">
                                          <img src="${doctorData.image}" alt="Doctor" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
                                        </div>
                                        ` : ''}
                                        <h3 style="margin: 0 0 5px 0; color: #22543d; font-size: 24px; font-weight: 700;">
                                          ${doctorData.name}
                                        </h3>
                                        <p style="margin: 0; color: #2f855a; font-size: 15px; font-weight: 600;">
                                          ${doctorData.speciality}
                                        </p>
                                      </td>
                                    </tr>
                                  </table>
                                  
                                  <!-- Appointment Details -->
                                  <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                      <td style="padding: 15px 0; border-bottom: 2px solid rgba(72, 187, 120, 0.2);">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                          <tr>
                                            <td width="40" valign="top">
                                              <span style="font-size: 24px;">📅</span>
                                            </td>
                                            <td valign="middle">
                                              <p style="margin: 0 0 3px 0; color: #2f855a; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                                                Date
                                              </p>
                                              <p style="margin: 0; color: #22543d; font-size: 18px; font-weight: 700;">
                                                ${formattedDate}
                                              </p>
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                    
                                    <tr>
                                      <td style="padding: 15px 0; border-bottom: 2px solid rgba(72, 187, 120, 0.2);">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                          <tr>
                                            <td width="40" valign="top">
                                              <span style="font-size: 24px;">⏰</span>
                                            </td>
                                            <td valign="middle">
                                              <p style="margin: 0 0 3px 0; color: #2f855a; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                                                Time
                                              </p>
                                              <p style="margin: 0; color: #22543d; font-size: 18px; font-weight: 700;">
                                                ${slotTime}
                                              </p>
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                    
                                    <tr>
                                      <td style="padding: 15px 0; border-bottom: 2px solid rgba(72, 187, 120, 0.2);">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                          <tr>
                                            <td width="40" valign="top">
                                              <span style="font-size: 24px;">📍</span>
                                            </td>
                                            <td valign="middle">
                                              <p style="margin: 0 0 3px 0; color: #2f855a; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                                                Location
                                              </p>
                                              <p style="margin: 0; color: #22543d; font-size: 16px; font-weight: 600;">
                                                ${doctorData.address?.line1 || 'Prescripto Medical Center'}
                                              </p>
                                              ${doctorData.address?.line2 ? `<p style="margin: 3px 0 0 0; color: #2f855a; font-size: 14px;">${doctorData.address.line2}</p>` : ''}
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                    
                                    <tr>
                                      <td style="padding: 15px 0;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                          <tr>
                                            <td width="40" valign="top">
                                              <span style="font-size: 24px;">💰</span>
                                            </td>
                                            <td valign="middle">
                                              <p style="margin: 0 0 3px 0; color: #2f855a; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                                                Consultation Fee
                                              </p>
                                              <p style="margin: 0; color: #22543d; font-size: 20px; font-weight: 700;">
                                                $${doctorData.fees}
                                              </p>
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </table>
                                  
                                </div>
                              </td>
                            </tr>
                          </table>
                          
                          <!-- Important Reminders -->
                          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 25px;">
                            <tr>
                              <td>
                                <div style="background: linear-gradient(135deg, #ebf8ff 0%, #bee3f8 100%); border-left: 5px solid #4299e1; border-radius: 12px; padding: 20px 25px;">
                                  <h4 style="margin: 0 0 12px 0; color: #2c5282; font-size: 16px; font-weight: 700;">
                                    📝 Important Reminders
                                  </h4>
                                  <ul style="margin: 0; padding-left: 20px; color: #2b6cb0; font-size: 14px; line-height: 1.8;">
                                    <li style="margin-bottom: 8px;">Please arrive 10 minutes before your scheduled time</li>
                                    <li style="margin-bottom: 8px;">Bring any previous medical records or test reports</li>
                                    <li style="margin-bottom: 8px;">Bring a valid ID proof for verification</li>
                                    <li>If you need to reschedule, please inform us at least 24 hours in advance</li>
                                  </ul>
                                </div>
                              </td>
                            </tr>
                          </table>
                          
                          <!-- Action Buttons -->
                          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                            <tr>
                              <td align="center">
                                <table cellpadding="0" cellspacing="0">
                                  <tr>
                                    <td style="padding: 0 8px;">
                                      <a href="#" style="display: inline-block; background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: #ffffff; text-decoration: none; padding: 14px 35px; border-radius: 50px; font-size: 15px; font-weight: 700; box-shadow: 0 6px 20px rgba(72, 187, 120, 0.4);">
                                        View Appointment
                                      </a>
                                    </td>
                                    <td style="padding: 0 8px;">
                                      <a href="#" style="display: inline-block; background: #ffffff; color: #48bb78; text-decoration: none; padding: 14px 35px; border-radius: 50px; font-size: 15px; font-weight: 700; border: 2px solid #48bb78;">
                                        Add to Calendar
                                      </a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                          
                          <!-- Contact Info -->
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td>
                                <div style="background: linear-gradient(135deg, #fef5e7 0%, #fdeab3 100%); border-left: 5px solid #f6ad55; border-radius: 12px; padding: 18px 25px;">
                                  <p style="margin: 0; color: #7c2d12; font-size: 14px; line-height: 1.7;">
                                    📞 <strong>Need Help?</strong> Contact us at <a href="tel:+911234567890" style="color: #ed8936; text-decoration: none; font-weight: 600;">+91 123 456 7890</a> or email <a href="mailto:support@prescripto.com" style="color: #ed8936; text-decoration: none; font-weight: 600;">support@prescripto.com</a>
                                  </p>
                                </div>
                              </td>
                            </tr>
                          </table>
                          
                        </td>
                      </tr>
                      
                      <!-- Divider -->
                      <tr>
                        <td style="padding: 0 50px;">
                          <div style="height: 2px; background: linear-gradient(90deg, transparent 0%, #e2e8f0 20%, #cbd5e0 50%, #e2e8f0 80%, transparent 100%);"></div>
                        </td>
                      </tr>
                      
                      <!-- Footer -->
                      <tr>
                        <td style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); padding: 40px 50px; text-align: center;">
                          
                          <!-- Social Links -->
                          <table cellpadding="0" cellspacing="0" style="margin: 0 auto 25px auto;">
                            <tr>
                              <td>
                                <a href="#" style="display: inline-block; width: 40px; height: 40px; background: #48bb78; border-radius: 50%; text-align: center; line-height: 40px; color: #ffffff; text-decoration: none; margin: 0 8px; font-size: 18px;">📧</a>
                              </td>
                              <td>
                                <a href="#" style="display: inline-block; width: 40px; height: 40px; background: #48bb78; border-radius: 50%; text-align: center; line-height: 40px; color: #ffffff; text-decoration: none; margin: 0 8px; font-size: 18px;">🌐</a>
                              </td>
                              <td>
                                <a href="#" style="display: inline-block; width: 40px; height: 40px; background: #48bb78; border-radius: 50%; text-align: center; line-height: 40px; color: #ffffff; text-decoration: none; margin: 0 8px; font-size: 18px;">📱</a>
                              </td>
                            </tr>
                          </table>
                          
                          <p style="margin: 0 0 10px 0; color: #4a5568; font-size: 15px; font-weight: 600;">
                            Prescripto - Your Health, Our Priority
                          </p>
                          
                          <p style="margin: 0 0 20px 0; color: #718096; font-size: 13px; line-height: 1.6;">
                            Making healthcare accessible and convenient for everyone.
                          </p>
                          
                          <div style="margin-bottom: 20px;">
                            <a href="#" style="color: #48bb78; text-decoration: none; font-size: 13px; margin: 0 12px; font-weight: 500;">Help Center</a>
                            <span style="color: #cbd5e0;">•</span>
                            <a href="#" style="color: #48bb78; text-decoration: none; font-size: 13px; margin: 0 12px; font-weight: 500;">Privacy Policy</a>
                            <span style="color: #cbd5e0;">•</span>
                            <a href="#" style="color: #48bb78; text-decoration: none; font-size: 13px; margin: 0 12px; font-weight: 500;">Terms of Service</a>
                          </div>
                          
                          <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                            © ${new Date().getFullYear()} Prescripto. All rights reserved.
                          </p>
                          
                          <p style="margin: 10px 0 0 0; color: #cbd5e0; font-size: 11px; font-style: italic;">
                            This is an automated appointment confirmation. Please do not reply to this email.
                          </p>
                          
                        </td>
                      </tr>
                      
                    </table>
                    
                  </td>
                </tr>
              </table>
              
            </body>
            </html>
          `,
        }
        
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Email sending failed:", error)
          } else {
            console.log("Appointment confirmation email sent successfully")
          }
        })

        res.json({success:true,message:"Appointment has been booked"})
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
}

const listAppoinment = async (req,res) =>{
        try {
            const userId = req.userId;
            const appoinment = await appoinmentModel.find({userId})
            res.json({success:true,appoinment})
        } catch (error) {
          console.error(error);
          res.json({ success: false, message: error.message });
        }
}
//Cancel Appoinment 

const cancelAppoinment = async (req, res) => {
  try {
    const { appoinmentId } = req.body;
    const userId = req.userId;

    if (!appoinmentId) {
      return res.status(400).json({ success: false, message: "Appointment ID is required" });
    }

    const appoinmentData = await appoinmentModel.findById(appoinmentId);
    if (!appoinmentData) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    if (appoinmentData.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized action" });
    }

    // Mark appointment as cancelled
    await appoinmentModel.findByIdAndUpdate(appoinmentId, { cancelled: true });

    // Release doctor's slot
    const { docId, slotDate, slotTime, userData, doctorData } = appoinmentData;
    const doctor = await doctorModel.findById(docId);
    let slotsBooked = doctor.slotsBooked || {};

    if (slotsBooked[slotDate]) {
      slotsBooked[slotDate] = slotsBooked[slotDate].filter((e) => e !== slotTime);
      await doctorModel.findByIdAndUpdate(docId, { slotsBooked });
    }

    // Format the date
    const [day, month, year] = slotDate.split('_');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedDate = `${day} ${monthNames[parseInt(month) - 1]} ${year}`;

    // Send cancellation email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "avadhgolakiya88@gmail.com",
        pass: "zvtpdprzfebryjfe", 
      },
    })
    
    const mailOptions = {
      from: "avadhgolakiya88@gmail.com",
      to: userData.email,
      subject: "❌ Appointment Cancelled - Prescripto",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          
          <table width="100%" cellpadding="0" cellspacing="0" style="min-height: 100vh; padding: 40px 20px;">
            <tr>
              <td align="center">
                
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 650px; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);">
                  
                  <!-- Header Wave Design -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #fc8181 0%, #f56565 50%, #e53e3e 100%); padding: 0; position: relative; height: 200px;">
                      <table width="100%" cellpadding="0" cellspacing="0" style="height: 200px;">
                        <tr>
                          <td align="center" valign="middle">
                            <!-- Brand Logo/Name -->
                            <div style="background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); border-radius: 20px; padding: 15px 35px; display: inline-block; border: 2px solid rgba(255, 255, 255, 0.3);">
                              <h1 style="margin: 0; color: #ffffff; font-size: 36px; font-weight: 800; letter-spacing: 1px; text-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                                💊 Prescripto
                              </h1>
                            </div>
                          </td>
                        </tr>
                      </table>
                      <!-- Wave SVG Bottom -->
                      <div style="position: absolute; bottom: -1px; left: 0; width: 100%;">
                        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style="display: block; width: 100%; height: 60px;">
                          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#ffffff"></path>
                        </svg>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 20px 50px 40px 50px;">
                      
                      <!-- Cancel Icon -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 25px;">
                        <tr>
                          <td align="center">
                            <div style="width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(135deg, #fc8181 0%, #f56565 100%); display: inline-block; text-align: center; line-height: 100px; box-shadow: 0 8px 25px rgba(252, 129, 129, 0.4);">
                              <span style="font-size: 50px; vertical-align: middle;">❌</span>
                            </div>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Cancellation Heading -->
                      <h2 style="margin: 0 0 10px 0; color: #1a202c; font-size: 32px; font-weight: 700; text-align: center;">
                        Appointment Cancelled
                      </h2>
                      
                      <p style="margin: 0 0 30px 0; color: #718096; font-size: 16px; line-height: 1.6; text-align: center;">
                        Hi <strong style="color: #fc8181;">${userData.name}</strong>
                      </p>
                      
                      <p style="margin: 0 0 35px 0; color: #4a5568; font-size: 15px; line-height: 1.8; text-align: center;">
                        Your appointment has been successfully cancelled. The slot has been released and is now available for other patients.
                      </p>
                      
                      <!-- Cancelled Appointment Details Card -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                        <tr>
                          <td>
                            <div style="background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%); border-radius: 20px; padding: 30px; border: 3px solid #fc8181;">
                              
                              <!-- Doctor Info -->
                              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 25px;">
                                <tr>
                                  <td align="center">
                                    ${doctorData.image ? `
                                    <div style="width: 80px; height: 80px; border-radius: 50%; overflow: hidden; border: 4px solid #fc8181; box-shadow: 0 6px 20px rgba(252, 129, 129, 0.3); display: inline-block; margin-bottom: 15px; opacity: 0.6;">
                                      <img src="${doctorData.image}" alt="Doctor" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
                                    </div>
                                    ` : ''}
                                    <h3 style="margin: 0 0 5px 0; color: #742a2a; font-size: 24px; font-weight: 700;">
                                      ${doctorData.name}
                                    </h3>
                                    <p style="margin: 0; color: #c53030; font-size: 15px; font-weight: 600;">
                                      ${doctorData.speciality}
                                    </p>
                                  </td>
                                </tr>
                              </table>
                              
                              <!-- Cancelled Appointment Details -->
                              <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td style="padding: 15px 0; border-bottom: 2px solid rgba(252, 129, 129, 0.2);">
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                      <tr>
                                        <td width="40" valign="top">
                                          <span style="font-size: 24px;">📅</span>
                                        </td>
                                        <td valign="middle">
                                          <p style="margin: 0 0 3px 0; color: #c53030; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                                            Date
                                          </p>
                                          <p style="margin: 0; color: #742a2a; font-size: 18px; font-weight: 700;">
                                            ${formattedDate}
                                          </p>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                                
                                <tr>
                                  <td style="padding: 15px 0; border-bottom: 2px solid rgba(252, 129, 129, 0.2);">
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                      <tr>
                                        <td width="40" valign="top">
                                          <span style="font-size: 24px;">⏰</span>
                                        </td>
                                        <td valign="middle">
                                          <p style="margin: 0 0 3px 0; color: #c53030; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                                            Time
                                          </p>
                                          <p style="margin: 0; color: #742a2a; font-size: 18px; font-weight: 700;">
                                            ${slotTime}
                                          </p>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                                
                                <tr>
                                  <td style="padding: 15px 0;">
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                      <tr>
                                        <td width="40" valign="top">
                                          <span style="font-size: 24px;">📍</span>
                                        </td>
                                        <td valign="middle">
                                          <p style="margin: 0 0 3px 0; color: #c53030; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                                            Location
                                          </p>
                                          <p style="margin: 0; color: #742a2a; font-size: 16px; font-weight: 600;">
                                            ${doctorData.address?.line1 || 'Prescripto Medical Center'}
                                          </p>
                                          ${doctorData.address?.line2 ? `<p style="margin: 3px 0 0 0; color: #c53030; font-size: 14px;">${doctorData.address.line2}</p>` : ''}
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                              
                            </div>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Need to Rebook -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                        <tr>
                          <td>
                            <div style="background: linear-gradient(135deg, #ebf8ff 0%, #bee3f8 100%); border-left: 5px solid #4299e1; border-radius: 12px; padding: 20px 25px;">
                              <p style="margin: 0; color: #2c5282; font-size: 14px; line-height: 1.7;">
                                💡 <strong>Need to Reschedule?</strong> You can book a new appointment anytime through your Prescripto dashboard. We have many available slots with qualified healthcare professionals.
                              </p>
                            </div>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Action Button -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                        <tr>
                          <td align="center">
                            <a href="#" style="display: inline-block; background: linear-gradient(135deg, #5f6fff 0%, #8b9fff 100%); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 50px; font-size: 15px; font-weight: 700; box-shadow: 0 6px 20px rgba(95, 111, 255, 0.4);">
                              Book New Appointment
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Contact Info -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td>
                            <div style="background: linear-gradient(135deg, #fef5e7 0%, #fdeab3 100%); border-left: 5px solid #f6ad55; border-radius: 12px; padding: 18px 25px;">
                              <p style="margin: 0; color: #7c2d12; font-size: 14px; line-height: 1.7;">
                                📞 <strong>Questions?</strong> Contact us at <a href="tel:+911234567890" style="color: #ed8936; text-decoration: none; font-weight: 600;">+91 123 456 7890</a> or email <a href="mailto:support@prescripto.com" style="color: #ed8936; text-decoration: none; font-weight: 600;">support@prescripto.com</a>
                              </p>
                            </div>
                          </td>
                        </tr>
                      </table>
                      
                    </td>
                  </tr>
                  
                  <!-- Divider -->
                  <tr>
                    <td style="padding: 0 50px;">
                      <div style="height: 2px; background: linear-gradient(90deg, transparent 0%, #e2e8f0 20%, #cbd5e0 50%, #e2e8f0 80%, transparent 100%);"></div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); padding: 40px 50px; text-align: center;">
                      
                      <!-- Social Links -->
                      <table cellpadding="0" cellspacing="0" style="margin: 0 auto 25px auto;">
                        <tr>
                          <td>
                            <a href="#" style="display: inline-block; width: 40px; height: 40px; background: #5f6fff; border-radius: 50%; text-align: center; line-height: 40px; color: #ffffff; text-decoration: none; margin: 0 8px; font-size: 18px;">📧</a>
                          </td>
                          <td>
                            <a href="#" style="display: inline-block; width: 40px; height: 40px; background: #5f6fff; border-radius: 50%; text-align: center; line-height: 40px; color: #ffffff; text-decoration: none; margin: 0 8px; font-size: 18px;">🌐</a>
                          </td>
                          <td>
                            <a href="#" style="display: inline-block; width: 40px; height: 40px; background: #5f6fff; border-radius: 50%; text-align: center; line-height: 40px; color: #ffffff; text-decoration: none; margin: 0 8px; font-size: 18px;">📱</a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 0 0 10px 0; color: #4a5568; font-size: 15px; font-weight: 600;">
                        Prescripto - Your Health, Our Priority
                      </p>
                      
                      <p style="margin: 0 0 20px 0; color: #718096; font-size: 13px; line-height: 1.6;">
                        Making healthcare accessible and convenient for everyone.
                      </p>
                      
                      <div style="margin-bottom: 20px;">
                        <a href="#" style="color: #5f6fff; text-decoration: none; font-size: 13px; margin: 0 12px; font-weight: 500;">Help Center</a>
                        <span style="color: #cbd5e0;">•</span>
                        <a href="#" style="color: #5f6fff; text-decoration: none; font-size: 13px; margin: 0 12px; font-weight: 500;">Privacy Policy</a>
                        <span style="color: #cbd5e0;">•</span>
                        <a href="#" style="color: #5f6fff; text-decoration: none; font-size: 13px; margin: 0 12px; font-weight: 500;">Terms of Service</a>
                      </div>
                      
                      <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                        © ${new Date().getFullYear()} Prescripto. All rights reserved.
                      </p>
                      
                      <p style="margin: 10px 0 0 0; color: #cbd5e0; font-size: 11px; font-style: italic;">
                        This is an automated cancellation notification. Please do not reply to this email.
                      </p>
                      
                    </td>
                  </tr>
                  
                </table>
                
              </td>
            </tr>
          </table>
          
        </body>
        </html>
      `,
    }
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email sending failed:", error)
      } else {
        console.log("Cancellation email sent successfully")
      }
    })

    return res.json({ success: true, message: "Appointment Cancelled" });

  } catch (error) {
    console.error("Cancel Appointment Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
//Payment Api
const razorpayInstance = new razorpay({
  key_id:process.env.RAZOR_PAY_ID,
  key_secret:process.env.RAZOR_PAY_SCERECT,
})
const razorpayPayment = async (req,res)=>{

      try {
        const { appoinmentId } = req.body;

        const appoinmentData = await appoinmentModel.findById(appoinmentId)
        if(!appoinmentData || appoinmentData.cancelled){
          return res.json({success:false,message:"Appoinment cancelled or not a found"})
        }
        const options = {
          amount:appoinmentData.amount * 100,
          currency:process.env.CURRENCY,
          receipt:appoinmentId
        }
        // create order
        const order = await razorpayInstance.orders.create(options)
        res.json({success:true,order})
      } catch (error) {
        console.error("Cancel Appointment Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
      }
}

// API to verify payment of razorpay

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    const order = await razorpayInstance.orders.fetch(razorpay_order_id);
    const appointmentId = order.receipt;

    const updatedAppointment = await appoinmentModel.findByIdAndUpdate(
      appointmentId,
      { payment: true },
      { new: true }
    );

   
    const appointmentData = await appoinmentModel.findById(appointmentId);
    const { userData, doctorData, slotDate, slotTime, amount } = appointmentData;

   
    const [day, month, year] = slotDate.split('_');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedDate = `${day} ${monthNames[parseInt(month) - 1]} ${year}`;

    
    const invoiceNumber = `USD-${Date.now()}`;
    const invoiceDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });


    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "avadhgolakiya88@gmail.com",
        pass: "zvtpdprzfebryjfe", 
      },
    });

    const mailOptions = {
      from: "avadhgolakiya88@gmail.com",
      to: userData.email,
      subject: "💳 Payment Successful - Invoice Attached | Prescripto",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          
          <table width="100%" cellpadding="0" cellspacing="0" style="min-height: 100vh; padding: 40px 20px;">
            <tr>
              <td align="center">
                
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 700px; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);">
                  
                  <!-- Header Wave Design -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #48bb78 0%, #38a169 50%, #2f855a 100%); padding: 0; position: relative; height: 200px;">
                      <table width="100%" cellpadding="0" cellspacing="0" style="height: 200px;">
                        <tr>
                          <td align="center" valign="middle">
                            <div style="background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); border-radius: 20px; padding: 15px 35px; display: inline-block; border: 2px solid rgba(255, 255, 255, 0.3);">
                              <h1 style="margin: 0; color: #ffffff; font-size: 36px; font-weight: 800; letter-spacing: 1px; text-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                                💊 Prescripto
                              </h1>
                            </div>
                          </td>
                        </tr>
                      </table>
                      <div style="position: absolute; bottom: -1px; left: 0; width: 100%;">
                        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style="display: block; width: 100%; height: 60px;">
                          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#ffffff"></path>
                        </svg>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 20px 50px 40px 50px;">
                      
                      <!-- Success Icon -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 25px;">
                        <tr>
                          <td align="center">
                            <div style="width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); display: inline-block; text-align: center; line-height: 100px; box-shadow: 0 8px 25px rgba(72, 187, 120, 0.4);">
                              <span style="font-size: 50px; vertical-align: middle;">💳</span>
                            </div>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Payment Success Heading -->
                      <h2 style="margin: 0 0 10px 0; color: #1a202c; font-size: 32px; font-weight: 700; text-align: center;">
                        Payment Successful!
                      </h2>
                      
                      <p style="margin: 0 0 30px 0; color: #718096; font-size: 16px; line-height: 1.6; text-align: center;">
                        Hi <strong style="color: #48bb78;">${userData.name}</strong>
                      </p>
                      
                      <p style="margin: 0 0 35px 0; color: #4a5568; font-size: 15px; line-height: 1.8; text-align: center;">
                        Thank you for your payment. Your appointment has been confirmed and payment has been processed successfully.
                      </p>
                      
                      <!-- Invoice Card -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                        <tr>
                          <td>
                            <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border-radius: 20px; padding: 30px; border: 2px solid #e2e8f0;">
                              
                              <!-- Invoice Header -->
                              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 25px;">
                                <tr>
                                  <td>
                                    <h3 style="margin: 0 0 5px 0; color: #1a202c; font-size: 22px; font-weight: 700;">
                                      INVOICE
                                    </h3>
                                    <p style="margin: 0; color: #718096; font-size: 13px;">
                                      Invoice #: <strong>${invoiceNumber}</strong>
                                    </p>
                                  </td>
                                  <td align="right">
                                    <p style="margin: 0; color: #718096; font-size: 13px;">
                                      Date: <strong>${invoiceDate}</strong>
                                    </p>
                                  </td>
                                </tr>
                              </table>
                              
                              <!-- Divider -->
                              <div style="height: 2px; background: #cbd5e0; margin-bottom: 25px;"></div>
                              
                              <!-- Bill To -->
                              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 25px;">
                                <tr>
                                  <td style="vertical-align: top; width: 50%;">
                                    <p style="margin: 0 0 8px 0; color: #718096; font-size: 12px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">
                                      Bill To
                                    </p>
                                    <p style="margin: 0 0 5px 0; color: #1a202c; font-size: 15px; font-weight: 600;">
                                      ${userData.name}
                                    </p>
                                    <p style="margin: 0; color: #4a5568; font-size: 13px; line-height: 1.6;">
                                      ${userData.email}<br>
                                      ${userData.phone || ''}
                                    </p>
                                  </td>
                                  <td align="right" style="vertical-align: top; width: 50%;">
                                    <p style="margin: 0 0 8px 0; color: #718096; font-size: 12px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">
                                      Payment ID
                                    </p>
                                    <p style="margin: 0; color: #4a5568; font-size: 13px; word-break: break-all;">
                                      ${razorpay_payment_id}
                                    </p>
                                  </td>
                                </tr>
                              </table>
                              
                              <!-- Items Table -->
                              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                                <thead>
                                  <tr style="background: #48bb78;">
                                    <th style="padding: 12px; text-align: left; color: #ffffff; font-size: 13px; font-weight: 600; border-radius: 8px 0 0 0;">
                                      Description
                                    </th>
                                    <th style="padding: 12px; text-align: center; color: #ffffff; font-size: 13px; font-weight: 600;">
                                      Date & Time
                                    </th>
                                    <th style="padding: 12px; text-align: right; color: #ffffff; font-size: 13px; font-weight: 600; border-radius: 0 8px 0 0;">
                                      Amount
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr style="background: #ffffff;">
                                    <td style="padding: 15px 12px; border-bottom: 1px solid #e2e8f0;">
                                      <p style="margin: 0 0 5px 0; color: #1a202c; font-size: 14px; font-weight: 600;">
                                        Medical Consultation
                                      </p>
                                      <p style="margin: 0; color: #718096; font-size: 13px;">
                                        Dr. ${doctorData.name}<br>
                                        ${doctorData.speciality}
                                      </p>
                                    </td>
                                    <td style="padding: 15px 12px; text-align: center; border-bottom: 1px solid #e2e8f0; color: #4a5568; font-size: 13px;">
                                      ${formattedDate}<br>
                                      ${slotTime}
                                    </td>
                                    <td style="padding: 15px 12px; text-align: right; border-bottom: 1px solid #e2e8f0; color: #1a202c; font-size: 15px; font-weight: 600;">
                                      $${amount}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              
                              <!-- Total Section -->
                              <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td align="right" style="padding: 15px 0;">
                                    <table cellpadding="0" cellspacing="0" align="right">
                                      <tr>
                                        <td style="padding: 8px 20px 8px 0; color: #718096; font-size: 14px;">
                                          Subtotal:
                                        </td>
                                        <td style="padding: 8px 0; color: #1a202c; font-size: 14px; font-weight: 600; min-width: 80px; text-align: right;">
                                          $${amount}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td style="padding: 8px 20px 8px 0; color: #718096; font-size: 14px;">
                                          Tax (0%):
                                        </td>
                                        <td style="padding: 8px 0; color: #1a202c; font-size: 14px; font-weight: 600; text-align: right;">
                                          $0
                                        </td>
                                      </tr>
                                      <tr style="border-top: 2px solid #48bb78;">
                                        <td style="padding: 12px 20px 0 0; color: #1a202c; font-size: 16px; font-weight: 700;">
                                          Total Paid:
                                        </td>
                                        <td style="padding: 12px 0 0 0; color: #48bb78; font-size: 18px; font-weight: 700; text-align: right;">
                                          $${amount}
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                              
                            </div>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Payment Status -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 25px;">
                        <tr>
                          <td>
                            <div style="background: linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%); border-left: 5px solid #48bb78; border-radius: 12px; padding: 20px 25px;">
                              <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td width="50" valign="top">
                                    <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); border-radius: 50%; text-align: center; line-height: 40px;">
                                      <span style="font-size: 20px;">✓</span>
                                    </div>
                                  </td>
                                  <td valign="middle" style="padding-left: 15px;">
                                    <p style="margin: 0 0 5px 0; color: #22543d; font-size: 16px; font-weight: 700;">
                                      Payment Verified
                                    </p>
                                    <p style="margin: 0; color: #2f855a; font-size: 14px; line-height: 1.5;">
                                      Your payment has been successfully verified and processed. A confirmation has been sent to your registered email.
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Next Steps -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                        <tr>
                          <td>
                            <div style="background: linear-gradient(135deg, #ebf8ff 0%, #bee3f8 100%); border-left: 5px solid #4299e1; border-radius: 12px; padding: 20px 25px;">
                              <h4 style="margin: 0 0 12px 0; color: #2c5282; font-size: 16px; font-weight: 700;">
                                📋 What's Next?
                              </h4>
                              <ul style="margin: 0; padding-left: 20px; color: #2b6cb0; font-size: 14px; line-height: 1.8;">
                                <li style="margin-bottom: 8px;">You will receive an appointment reminder 24 hours before your scheduled time</li>
                                <li style="margin-bottom: 8px;">Please arrive 10 minutes early to complete any necessary paperwork</li>
                                <li style="margin-bottom: 8px;">Bring a valid ID and any relevant medical records</li>
                                <li>You can view or manage your appointment from your dashboard</li>
                              </ul>
                            </div>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Action Buttons -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                        <tr>
                          <td align="center">
                            <table cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="padding: 0 8px;">
                                  <a href="#" style="display: inline-block; background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: #ffffff; text-decoration: none; padding: 14px 35px; border-radius: 50px; font-size: 15px; font-weight: 700; box-shadow: 0 6px 20px rgba(72, 187, 120, 0.4);">
                                    View Appointment
                                  </a>
                                </td>
                                <td style="padding: 0 8px;">
<a href="http://localhost:4000/api/user/invoice/${appointmentId}" style="display: inline-block; background: #ffffff; color: #48bb78; text-decoration: none; padding: 14px 35px; border-radius: 50px; font-size: 15px; font-weight: 700; border: 2px solid #48bb78;">
  Download Invoice
</a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Contact Info -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td>
                            <div style="background: linear-gradient(135deg, #fef5e7 0%, #fdeab3 100%); border-left: 5px solid #f6ad55; border-radius: 12px; padding: 18px 25px;">
                              <p style="margin: 0; color: #7c2d12; font-size: 14px; line-height: 1.7;">
                                📞 <strong>Need Help?</strong> Contact us at <a href="tel:+911234567890" style="color: #ed8936; text-decoration: none; font-weight: 600;">+91 123 456 7890</a> or email <a href="mailto:support@prescripto.com" style="color: #ed8936; text-decoration: none; font-weight: 600;">support@prescripto.com</a>
                              </p>
                            </div>
                          </td>
                        </tr>
                      </table>
                      
                    </td>
                  </tr>
                  
                  <!-- Divider -->
                  <tr>
                    <td style="padding: 0 50px;">
                      <div style="height: 2px; background: linear-gradient(90deg, transparent 0%, #e2e8f0 20%, #cbd5e0 50%, #e2e8f0 80%, transparent 100%);"></div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); padding: 40px 50px; text-align: center;">
                      
                      <table cellpadding="0" cellspacing="0" style="margin: 0 auto 25px auto;">
                        <tr>
                          <td>
                            <a href="#" style="display: inline-block; width: 40px; height: 40px; background: #48bb78; border-radius: 50%; text-align: center; line-height: 40px; color: #ffffff; text-decoration: none; margin: 0 8px; font-size: 18px;">📧</a>
                          </td>
                          <td>
                            <a href="#" style="display: inline-block; width: 40px; height: 40px; background: #48bb78; border-radius: 50%; text-align: center; line-height: 40px; color: #ffffff; text-decoration: none; margin: 0 8px; font-size: 18px;">🌐</a>
                          </td>
                          <td>
                            <a href="#" style="display: inline-block; width: 40px; height: 40px; background: #48bb78; border-radius: 50%; text-align: center; line-height: 40px; color: #ffffff; text-decoration: none; margin: 0 8px; font-size: 18px;">📱</a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 0 0 10px 0; color: #4a5568; font-size: 15px; font-weight: 600;">
                        Prescripto - Your Health, Our Priority
                      </p>
                      
                      <p style="margin: 0 0 20px 0; color: #718096; font-size: 13px; line-height: 1.6;">
                        Making healthcare accessible and convenient for everyone.
                      </p>
                      
                      <div style="margin-bottom: 20px;">
                        <a href="#" style="color: #48bb78; text-decoration: none; font-size: 13px; margin: 0 12px; font-weight: 500;">Help Center</a>
                        <span style="color: #cbd5e0;">•</span>
                        <a href="#" style="color: #48bb78; text-decoration: none; font-size: 13px; margin: 0 12px; font-weight: 500;">Privacy Policy</a>
                        <span style="color: #cbd5e0;">•</span>
                        <a href="#" style="color: #48bb78; text-decoration: none; font-size: 13px; margin: 0 12px; font-weight: 500;">Terms of Service</a>
                      </div>
                      
                      <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                        © ${new Date().getFullYear()} Prescripto. All rights reserved.
                      </p>
                      
                      <p style="margin: 10px 0 0 0; color: #cbd5e0; font-size: 11px; font-style: italic;">
                        This is an automated payment confirmation. Please do not reply to this email.
                      </p>
                      
                    </td>
                  </tr>
                  
                </table>
                
              </td>
            </tr>
          </table>
          
        </body>
        </html>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Invoice email sending failed:", error);
      } else {
        console.log("Invoice email sent successfully");
      }
    });

    return res.json({ success: true, message: "Payment successful", appointment: updatedAppointment });

  } catch (error) {
    console.error("Verify Payment Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const generateInvoicePDF = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    
    const appointmentData = await appoinmentModel.findById(appointmentId);
    
    if (!appointmentData) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }
    
    const { userData, doctorData, slotDate, slotTime, amount } = appointmentData;
    

    const [day, month, year] = slotDate.split('_');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedDate = `${day} ${monthNames[parseInt(month) - 1]} ${year}`;
    
    const invoiceNumber = `INV-${appointmentData._id}`;
    const invoiceDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
 
    const doc = new PDFDocument({ 
      margin: 50,
      size: 'A4'
    });
    

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoiceNumber}.pdf`);
    
    doc.pipe(res);
    
    
    const logoUrl = 'https://prescripto.vercel.app/assets/logo-BNCDj_dh.svg';
    const logoResponse = await axios.get(logoUrl, { responseType: 'arraybuffer' });
    const logoBuffer = Buffer.from(logoResponse.data);
    
  
    SVGtoPDF(doc, logoBuffer.toString(), 50, 50, { width: 150 });
    
   
    doc.fontSize(9)
       .fillColor('#666666')
       .text('Your Health, Our Priority', 50, 90)
       .text('support@prescripto.com', 50, 102)
       .text('+91 123 456 7890', 50, 114);
    
   
    const rightWidth = 195;
    
    doc.fontSize(28)
       .fillColor('#1a202c')
       .text('INVOICE', 350, 50, { width: rightWidth, align: 'right' });
    

    doc.fontSize(10)
       .fillColor('#4a5568')
       .text(`Invoice #: ${invoiceNumber}`, 350, 85, { width: rightWidth, align: 'right' })
       .text(`Date: ${invoiceDate}`, 350, 100, { width: rightWidth, align: 'right' });
    
   
    doc.fontSize(10);
    const statusY = 115;
    const statusText = 'Payment Status: ';
    const paidText = 'PAID';
    
    const statusWidth = doc.widthOfString(statusText);
    const paidWidth = doc.widthOfString(paidText);
    const badgePadding = 6;
    const gap = 5; // Reduced gap between status and PAID
    
    const rightEdge = 350 + rightWidth;
    const badgeWidth = paidWidth + (badgePadding * 2);
    const badgeX = rightEdge - badgeWidth;
    const statusTextX = badgeX - gap - statusWidth;
    
    
    doc.fillColor('#4a5568')
       .text(statusText, statusTextX, statusY);
    

    const fontHeight = doc.currentLineHeight();
    doc.roundedRect(badgeX, statusY - 1, badgeWidth, fontHeight + 2, 4)
       .fill('#48bb78');
    
    doc.fillColor('#ffffff')
       .text(paidText, badgeX + badgePadding, statusY);
    
    
    doc.moveTo(50, 145)
       .lineTo(545, 145)
       .strokeColor('#e2e8f0')
       .lineWidth(1)
       .stroke();
    
   
    let yPos = 170;
    
    
    doc.fontSize(11)
       .fillColor('#718096')
       .text('BILL TO:', 50, yPos);
    
    doc.fontSize(12)
       .fillColor('#1a202c')
       .text(userData.name, 50, yPos + 20)
       .fontSize(10)
       .fillColor('#4a5568')
       .text(userData.email, 50, yPos + 38)
       .text(userData.phone || 'N/A', 50, yPos + 52);
    

    doc.fontSize(11)
       .fillColor('#718096')
       .text('BILL FROM:', 320, yPos);
    
    doc.fontSize(12)
       .fillColor('#1a202c')
       .text(doctorData.name, 320, yPos + 20)
       .fontSize(10)
       .fillColor('#4a5568')
       .text(doctorData.speciality, 320, yPos + 38);
    
    if (doctorData.address) {
      doc.text(doctorData.address.line1 || '', 320, yPos + 52)
         .text(doctorData.address.line2 || '', 320, yPos + 66);
    }
    
    yPos = 280;
    

    doc.rect(50, yPos, 495, 30)
       .fillAndStroke('#5f6fff', '#5f6fff');
    
    doc.fontSize(11)
       .fillColor('#ffffff')
       .text('DESCRIPTION', 60, yPos + 10)
       .text('DATE & TIME', 260, yPos + 10)
       .text('AMOUNT', 450, yPos + 10);
    
    yPos += 30;
    doc.rect(50, yPos, 495, 60)
       .fillAndStroke('#f7fafc', '#e2e8f0')
       .lineWidth(0.5);
    
    doc.fontSize(11)
       .fillColor('#1a202c')
       .text('Medical Consultation', 60, yPos + 10)
       .fontSize(9)
       .fillColor('#718096')
       .text(`with ${doctorData.name}`, 60, yPos + 26)
       .text(doctorData.speciality, 60, yPos + 39);
    
    doc.fontSize(10)
       .fillColor('#4a5568')
       .text(formattedDate, 260, yPos + 15)
       .text(slotTime, 260, yPos + 30);
    
    doc.fontSize(12)
       .fillColor('#1a202c')
       .text(`$${amount}`, 450, yPos + 20);
    
    yPos += 90;
    
 
    doc.fontSize(10)
       .fillColor('#4a5568')
       .text('Subtotal:', 380, yPos)
       .text(`$${amount}`, 480, yPos, { align: 'right' });
    

    yPos += 20;
    doc.text('Tax (0%):', 380, yPos)
       .text('$0.00', 480, yPos, { align: 'right' });
    

    yPos += 20;
    doc.text('Discount:', 380, yPos)
       .text('$0.00', 480, yPos, { align: 'right' });
    

    yPos += 20;
    doc.moveTo(380, yPos)
       .lineTo(545, yPos)
       .strokeColor('#48bb78')
       .lineWidth(2)
       .stroke();
    
    
    yPos += 15;
    doc.fontSize(13)
       .fillColor('#1a202c')
       .text('TOTAL PAID:', 380, yPos)
       .fontSize(16)
       .fillColor('#48bb78')
       .text(`$${amount}`, 480, yPos, { align: 'right' });
    
    
    yPos += 50;
    
    doc.rect(50, yPos, 495, 60)
       .fillAndStroke('#f0fff4', '#48bb78')
       .lineWidth(1);
    
    doc.fontSize(11)
       .fillColor('#22543d')
       .text('Payment Method: Razorpay', 60, yPos + 12)
       .fontSize(9)
       .fillColor('#2f855a')
       .text('Transaction ID: ' + (appointmentData.razorpay_payment_id || 'N/A'), 60, yPos + 30)
       .text('Payment Date: ' + invoiceDate, 60, yPos + 44);
    
    
    yPos += 75;
    
    doc.fontSize(10)
       .fillColor('#718096')
       .text('Notes:', 50, yPos)
       .fontSize(9)
       .fillColor('#4a5568')
       .text('• Please arrive 10 minutes before your scheduled appointment time', 50, yPos + 18)
       .text('• Bring a valid ID proof and any previous medical records', 50, yPos + 32)
       .text('• For any queries, contact us at support@prescripto.com or call +91 123 456 7890', 50, yPos + 46);
    
   
    yPos += 75;
    
    const signatureText = 'Authorized Signature:';
    const signatureTextWidth = doc.widthOfString(signatureText);
    const signatureBoxWidth = 150;
    const signatureStartX = 350;
    const signatureCenterX = signatureStartX + (signatureBoxWidth / 2);
    const textCenterX = signatureCenterX - (signatureTextWidth / 2);
    
    doc.fontSize(10)
       .fillColor('#4a5568')
       .text(signatureText, textCenterX, yPos);
    
   
    const path = require('path');
    const signaturePath = path.join(__dirname, '../public/assets/signature.png');
    
    try {
      if (fs.existsSync(signaturePath)) {
        doc.image(signaturePath, signatureStartX, yPos + 15, { width: signatureBoxWidth, height: 50 });
      } else {
      
        const sigY = yPos + 30;
        doc.save()
           .strokeColor('#1a202c')
           .lineWidth(2)
           .moveTo(signatureStartX, sigY)
           .bezierCurveTo(signatureStartX + 30, sigY - 8, signatureStartX + 60, sigY + 8, signatureStartX + 90, sigY - 3)
           .bezierCurveTo(signatureStartX + 95, sigY - 5, signatureStartX + 100, sigY, signatureStartX + 105, sigY + 3)
           .moveTo(signatureStartX + 10, sigY + 12)
           .bezierCurveTo(signatureStartX + 40, sigY + 3, signatureStartX + 70, sigY + 15, signatureStartX + 100, sigY + 8)
           .stroke()
           .restore();
      }
    } catch (err) {
      console.error('Signature loading error:', err);
     
      doc.moveTo(signatureStartX, yPos + 55)
         .lineTo(signatureStartX + signatureBoxWidth, yPos + 55)
         .strokeColor('#cbd5e0')
         .lineWidth(1)
         .stroke();
    }
    
   
    const footerY = 750;
    
    doc.moveTo(50, footerY)
       .lineTo(545, footerY)
       .strokeColor('#e2e8f0')
       .lineWidth(1)
       .stroke();
    
    doc.fontSize(8)
       .fillColor('#a0aec0')
       .text(
         'This is a computer-generated invoice and does not require a physical signature.',
         50, footerY + 10,
         { align: 'center', width: 495 }
       )
       .text(
         `© ${new Date().getFullYear()} Prescripto. All rights reserved. | www.prescripto.com`,
         50, footerY + 25,
         { align: 'center', width: 495 }
       );
    
    doc.end();
    
  } catch (error) {
    console.error('PDF Generation Error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate invoice' });
  }
};
module.exports = {registerUser,loginUser,getProfileData,updateProfile,bookAppoinment,listAppoinment,cancelAppoinment,razorpayPayment,verifyPayment,generateInvoicePDF};
