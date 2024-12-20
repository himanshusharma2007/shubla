const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const checkAuth = async (req, res, next) => {
  try {
    console.log('req.cookies', req.cookies)
    const token = req.cookies.token;
    console.log('token', token + "screate token" + process.env.JWT_KEY)
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const deCodedToken = jwt.verify(token, process.env.JWT_KEY);
    console.log('deCodedToken', deCodedToken)
    const user = await User.findById(deCodedToken._id);
    console.log('user', user)
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    res.user = user;
    next();
  } catch (error) {
    console.log('error', error)
    res.status(401).json({ message: "Unauthorized" });
  }
};
exports.checkAuth = checkAuth;
