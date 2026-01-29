const jwt = require('jsonwebtoken');

const authDoctor = (req, res, next) => {
  try {
    const { dtoken } = req.headers;

    if (!dtoken) {
      return res.json({ success: false, message: "Not Authorized, Login Again" });
    }

    const tokenDecode = jwt.verify(dtoken, process.env.JWT_SECRET);


    req.docId = tokenDecode.id;


    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

module.exports = authDoctor;
