const Admin = require("../model/adminModel");
const jwt = require("jsonwebtoken");
const checkAdmin = async (req, res, next) => {
  try {
    console.log('req.cookies in cehck admin ', req.cookies)
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized token" });
    const deCodedToken = jwt.verify(token, process.env.JWT_KEY);
    console.log('deCodedToken', deCodedToken)
    const admin = await Admin.findById(deCodedToken.id);
    if (!admin) return res.status(401).json({ message: "Unauthorized admin not found" });
    if (admin.role !== "superAdmin")
      return res.status(401).json({ message: "Unauthorized" });
    req.admin = admin;
    console.log("admin checked")
    next();
  } catch (error) {
    console.log("error", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};
exports.checkAdmin = checkAdmin;
