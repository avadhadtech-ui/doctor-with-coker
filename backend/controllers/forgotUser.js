const express = require('express')
const userModel = require('../models/UserModel')
const nodemailer = require("nodemailer")
const bcrypt = require("bcryptjs");

const findUser = async (req, res) => {
  try {
    const { email } = req.body


    const getUserData = await userModel.findOne({ email })
    if (!getUserData) {
      return res.json({
        success: false,
        message: `No user found with email: ${email}`,
      })
    }


    const OTP = Math.floor(100000 + Math.random() * 900000)
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);


    getUserData.otp = OTP.toString();
    getUserData.otpExpiresAt = otpExpiresAt;
    await getUserData.save();


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
      subject: "🔐 Your Prescripto Password Reset Code",
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
                  
       
                  <tr>
                    <td style="padding: 20px 50px 40px 50px;">
                      
                      <!-- User Profile Image -->
                      ${getUserData.image ? `
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 25px;">
                        <tr>
                          <td align="center">
                            <div style="width: 100px; height: 100px; border-radius: 50%; overflow: hidden; border: 5px solid #5f6fff; box-shadow: 0 8px 25px rgba(95, 111, 255, 0.3); display: inline-block;">
                              <img src="${getUserData.image}" alt="User Profile" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
                            </div>
                          </td>
                        </tr>
                      </table>
                      ` : ''}
                      
                      <!-- Greeting -->
                      <h2 style="margin: 0 0 10px 0; color: #1a202c; font-size: 28px; font-weight: 700; text-align: center;">
                        Password Reset Request
                      </h2>
                      
                      <p style="margin: 0 0 30px 0; color: #718096; font-size: 16px; line-height: 1.6; text-align: center;">
                        Hi <strong style="color: #5f6fff;">${getUserData.name || 'there'}</strong>! 👋
                      </p>
                      
                      <p style="margin: 0 0 35px 0; color: #4a5568; font-size: 15px; line-height: 1.8; text-align: center;">
                        We received a request to reset your password. Enter the verification code below to create a new password for your Prescripto account.
                      </p>
                      
                      <!-- OTP Card with Glassmorphism -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 35px;">
                        <tr>
                          <td align="center">
                            <div style="background: linear-gradient(135deg, #5f6fff 0%, #8b9fff 100%); border-radius: 20px; padding: 3px; display: inline-block; box-shadow: 0 10px 40px rgba(95, 111, 255, 0.4);">
                              <div style="background: linear-gradient(135deg, #5f6fff 0%, #7c8fff 100%); border-radius: 18px; padding: 40px 60px; position: relative; overflow: hidden;">
                                <!-- Decorative circles -->
                                <div style="position: absolute; top: -20px; right: -20px; width: 100px; height: 100px; background: rgba(255, 255, 255, 0.1); border-radius: 50%;"></div>
                                <div style="position: absolute; bottom: -30px; left: -30px; width: 120px; height: 120px; background: rgba(255, 255, 255, 0.1); border-radius: 50%;"></div>
                                
                                <p style="margin: 0 0 15px 0; color: rgba(255, 255, 255, 0.95); font-size: 13px; text-transform: uppercase; letter-spacing: 3px; font-weight: 600; text-align: center; position: relative; z-index: 1;">
                                  Your Verification Code
                                </p>
                                <p style="margin: 0; color: #ffffff; font-size: 48px; font-weight: 900; letter-spacing: 14px; text-align: center; text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); position: relative; z-index: 1; font-family: 'Courier New', monospace;">
                                  ${OTP}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </table>
                      
               
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                        <tr>
                          <td>
                            <div style="background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%); border-left: 5px solid #fc8181; border-radius: 12px; padding: 20px 25px; box-shadow: 0 4px 15px rgba(252, 129, 129, 0.2);">
                              <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td width="50" valign="top">
                                    <div style="width: 45px; height: 45px; background: linear-gradient(135deg, #fc8181 0%, #f56565 100%); border-radius: 50%; text-align: center; line-height: 45px;">
                                      <span style="font-size: 24px;">⏰</span>
                                    </div>
                                  </td>
                                  <td valign="middle" style="padding-left: 15px;">
                                    <p style="margin: 0 0 5px 0; color: #c53030; font-size: 16px; font-weight: 700; line-height: 1.4;">
                                      Valid for 10 Minutes Only!
                                    </p>
                                    <p style="margin: 0; color: #e53e3e; font-size: 14px; line-height: 1.5;">
                                      This code will expire soon. Please complete your password reset immediately.
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </td>
                        </tr>
                      </table>
                      
   
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td>
                            <div style="background: linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%); border-left: 5px solid #48bb78; border-radius: 12px; padding: 18px 25px;">
                              <p style="margin: 0; color: #22543d; font-size: 14px; line-height: 1.7;">
                                🔒 <strong>Security Tip:</strong> Never share this code with anyone. Prescripto will never ask you for this code via phone or email.
                              </p>
                            </div>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 30px 0 0 0; color: #718096; font-size: 14px; line-height: 1.7; text-align: center;">
                        If you didn't request a password reset, please ignore this email or <a href="#" style="color: #5f6fff; text-decoration: none; font-weight: 600;">contact our support team</a>.
                      </p>
                      
                    </td>
                  </tr>
                  

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
                        This is an automated message. Please do not reply to this email.
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
        return res.json({ success: false, message: "Failed to send OTP email." })
      } else {
        return res.json({
          success: true,
          message: `OTP sent to ${email}`,

        })
      }
    })

  } catch (error) {
    console.error(error)
    res.json({ success: false, message: "Server error" })
  }
}


const fetchOtp = async (req, res) => {
  try {
    const { otp, email } = req.body

    const user = await userModel.findOne({ email })
    if (!user) {
      return res.json({ success: false, message: "Invalid email or OTP." });
    }
    const now = new Date();
    if (user.otp !== otp) {
      return res.json({ success: false, message: "Incorrect OTP." });
    } if (user.otpExpiresAt < now) {
      return res.json({ success: false, message: "OTP has expired." });
    }
    if (user.otpExpiresAt < now) {
      return res.json({ success: false, message: "OTP has expired." });
    }
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    return res.json({ success: true, message: "OTP verified successfully." });
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error })
  }

}

const updatePassword = async (req, res) => {
  try {
    const { email, password, cpassword } = req.body;

    if (!email) {
      return res.json({ success: false, message: "Email is required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (password !== cpassword) {
      return res.json({ success: false, message: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userModel.findByIdAndUpdate(user._id, { password: hashedPassword }, { new: true });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "avadhgolakiya88@gmail.com",
        pass: "zvtpdprzfebryjfe",
      },
    });

    const mailOptions = {
      from: "avadhgolakiya88@gmail.com",
      to: email,
      subject: "✅ Your Prescripto Password Has Been Updated",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            @media only screen and (max-width: 600px) {
              .container { padding: 20px !important; }
              .main-table { max-width: 100% !important; }
              .header { height: 150px !important; }
              .logo { font-size: 28px !important; padding: 10px 20px !important; }
              .content { padding: 20px !important; }
              .otp-card { padding: 20px 30px !important; }
              .otp-text { font-size: 36px !important; letter-spacing: 8px !important; }
              .button { padding: 12px 30px !important; font-size: 14px !important; }
              .profile-img { width: 70px !important; height: 70px !important; }
              .success-icon { width: 80px !important; height: 80px !important; }
            }
            @media only screen and (max-width: 320px) {
              .container { padding: 10px !important; }
              .main-table { border-radius: 16px !important; }
              .header { height: 120px !important; }
              .logo { font-size: 24px !important; padding: 8px 15px !important; }
              .content { padding: 15px !important; }
              .otp-card { padding: 15px 20px !important; }
              .otp-text { font-size: 28px !important; letter-spacing: 6px !important; }
              .button { padding: 10px 25px !important; font-size: 12px !important; }
              .profile-img { width: 60px !important; height: 60px !important; }
              .success-icon { width: 60px !important; height: 60px !important; }
            }
          </style>
        </head>
        <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="min-height: 100vh; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" class="main-table" style="max-width: 650px; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);">
                  <tr>
                    <td style="background: linear-gradient(135deg, #5f6fff 0%, #7c8fff 50%, #9ca8ff 100%); padding: 0; position: relative; height: 200px;" class="header">
                      <table width="100%" cellpadding="0" cellspacing="0" style="height: 200px;">
<tr>
  <td align="center" valign="middle" style="text-align: center; padding: 20px;">
    <div style="width: 100px; height: 100px; background: rgba(255, 255, 255, 0.25); backdrop-filter: blur(10px); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; border: 3px solid rgba(255, 255, 255, 0.4); box-shadow: 0 10px 30px rgba(0,0,0,0.2); margin: 0 auto;" class="success-icon">
      <span style="font-size: 50px; line-height: 1;">✅</span>
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
                  <tr>
                    <td style="padding: 20px 50px 40px 50px;" class="content">
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 25px;">
                        <tr>
                          <td align="center">
                            <h1 style="margin: 0; color: #5f6fff; font-size: 32px; font-weight: 800; letter-spacing: 1px;" class="logo">
                              💊 Prescripto
                            </h1>
                          </td>
                        </tr>
                      </table>
                      ${user.image ? `
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 25px;">
                        <tr>
                          <td align="center">
                            <div style="width: 90px; height: 90px; border-radius: 50%; overflow: hidden; border: 4px solid #5f6fff; box-shadow: 0 8px 25px rgba(95, 111, 255, 0.3); display: inline-block;" class="profile-img">
                              <img src="${user.image}" alt="User Profile" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
                            </div>
                          </td>
                        </tr>
                      </table>
                      ` : ''}
                      <h2 style="margin: 0 0 10px 0; color: #1a202c; font-size: 28px; font-weight: 700; text-align: center;">
                        Password Updated Successfully! 🎉
                      </h2>
                      <p style="margin: 0 0 30px 0; color: #718096; font-size: 16px; line-height: 1.6; text-align: center;">
                        Hi <strong style="color: #5f6fff;">${user.name || 'there'}</strong>! 👋
                      </p>
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                        <tr>
                          <td>
                            <div style="background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%); border-left: 5px solid #5f6fff; border-radius: 12px; padding: 25px; box-shadow: 0 4px 15px rgba(95, 111, 255, 0.2);">
                              <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td width="50" valign="top">
                                    <div style="width: 45px; height: 45px; background: linear-gradient(135deg, #5f6fff 0%, #7c8fff 100%); border-radius: 50%; text-align: center; line-height: 45px;">
                                      <span style="font-size: 24px;">🔐</span>
                                    </div>
                                  </td>
                                  <td valign="middle" style="padding-left: 15px;">
                                    <p style="margin: 0 0 5px 0; color: #1e3a8a; font-size: 16px; font-weight: 700; line-height: 1.4;">
                                      Your password has been changed
                                    </p>
                                    <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.5;">
                                      You can now sign in to your Prescripto account with your new password.
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </td>
                        </tr>
                      </table>
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                        <tr>
                          <td>
                            <div style="background: #f7fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 25px;">
                              <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td style="padding-bottom: 15px; border-bottom: 1px solid #e2e8f0;">
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                      <tr>
                                        <td style="color: #718096; font-size: 14px; font-weight: 600;">
                                          📧 Email Address
                                        </td>
                                        <td align="right" style="color: #2d3748; font-size: 14px; font-weight: 600;">
                                          ${email}
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding-top: 15px;">
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                      <tr>
                                        <td style="color: #718096; font-size: 14px; font-weight: 600;">
                                          ⏰ Updated At
                                        </td>
                                        <td align="right" style="color: #2d3748; font-size: 14px; font-weight: 600;">
                                          ${new Date().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })}
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
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                        <tr>
                          <td>
                            <div style="background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%); border-left: 5px solid #fc8181; border-radius: 12px; padding: 20px 25px;">
                              <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td width="50" valign="top">
                                    <div style="width: 45px; height: 45px; background: linear-gradient(135deg, #fc8181 0%, #f56565 100%); border-radius: 50%; text-align: center; line-height: 45px;">
                                      <span style="font-size: 24px;">⚠️</span>
                                    </div>
                                  </td>
                                  <td valign="middle" style="padding-left: 15px;">
                                    <p style="margin: 0 0 5px 0; color: #c53030; font-size: 15px; font-weight: 700; line-height: 1.4;">
                                      Didn't make this change?
                                    </p>
                                    <p style="margin: 0; color: #e53e3e; font-size: 14px; line-height: 1.5;">
                                      If you didn't request this password change, please contact our support team immediately to secure your account.
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </td>
                        </tr>
                      </table>
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                        <tr>
                          <td align="center">
                            <a href="#" style="display: inline-block; background: linear-gradient(135deg, #5f6fff 0%, #7c8fff 100%); color: #ffffff; text-decoration: none; padding: 16px 45px; border-radius: 12px; font-size: 16px; font-weight: 700; box-shadow: 0 8px 20px rgba(95, 111, 255, 0.3); transition: transform 0.3s;" class="button">
                              Sign In to Your Account →
                            </a>
                          </td>
                        </tr>
                      </table>
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td>
                            <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-left: 5px solid #5f6fff; border-radius: 12px; padding: 20px 25px;">
                              <p style="margin: 0 0 12px 0; color: #1e3a8a; font-size: 15px; font-weight: 700;">
                                🛡️ Security Tips
                              </p>
                              <ul style="margin: 0; padding-left: 20px; color: #1e40af; font-size: 14px; line-height: 1.8;">
                                <li>Never share your password with anyone</li>
                                <li>Use a unique password for your Prescripto account</li>
                                <li>Enable two-factor authentication for extra security</li>
                                <li>Be cautious of phishing emails asking for your credentials</li>
                              </ul>
                            </div>
                          </td>
                        </tr>
                      </table>
                      <p style="margin: 30px 0 0 0; color: #718096; font-size: 14px; line-height: 1.7; text-align: center;">
                        Need help? <a href="#" style="color: #5f6fff; text-decoration: none; font-weight: 600;">Contact our support team</a>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 0 50px;">
                      <div style="height: 2px; background: linear-gradient(90deg, transparent 0%, #e2e8f0 20%, #cbd5e0 50%, #e2e8f0 80%, transparent 100%);"></div>
                    </td>
                  </tr>
                  <tr>
                    <td style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); padding: 40px 50px; text-align: center;">
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
                        This is an automated message. Please do not reply to this email.
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
        console.error("Email sending failed:", error);
        return res.json({ success: false, message: "Failed to send confirmation email." });
      }
      return res.json({
        success: true,
        message: "Password updated successfully and confirmation email sent.",
      });
    });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message || "Server error" });
  }
};
module.exports = { findUser, fetchOtp, updatePassword }