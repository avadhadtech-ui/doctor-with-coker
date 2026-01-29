const jwt = require('jsonwebtoken');

const authUser = (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.json({ success: false, message: "Not Authorized, Login Again" });
    }

    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    // Instead of req.body.userId
    req.userId = tokenDecode.id;


    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

module.exports = authUser;
