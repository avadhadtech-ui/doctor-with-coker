const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin.js');

const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers;
    
    if (!atoken) {
      return res.json({ success: false, message: "Not Authorized, Login Again" });
    }

    const tokenDecode = jwt.verify(atoken, process.env.JWT_SECRET);
    
    if (!tokenDecode.email && !tokenDecode.id) {
      return res.json({ success: false, message: "Invalid Token" });
    }

    const admin = await Admin.findOne({ 
      email: tokenDecode.email 
    });

    if (!admin) {
      return res.json({ success: false, message: "Admin not found" });
    }

 
    req.admin = admin;
    
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Not Authorized, Login Again" });
  }
};

module.exports = authAdmin;