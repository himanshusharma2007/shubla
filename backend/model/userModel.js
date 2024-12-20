const mongoose =  require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        select: false
    },
   
})

userSchema.pre("save", async function (next) {
    // Check if the password field is modified
    if (!this.isModified("password")) return next();
  
    try {
      // Generate a salt
      const salt = await bcrypt.genSalt(10);
  
      // Hash the password with the salt
      this.password = await bcrypt.hash(this.password, salt);
  
      next(); // Proceed to save
    } catch (error) {
      next(error); // Pass errors to Mongoose
    }
  });
  userSchema.methods.generateAuthToken = function () {
    console.log('this._id:', this._id); // Now this._id will refer to the user document
    const token = jwt.sign({ _id: this._id }, process.env.JWT_KEY);
    return token;
};

userSchema.methods.comparePassword = async function (password) {
    console.log('password', password)
    console.log('Hashed password from DB:', this.password);
    return await bcrypt.compare(password, this.password);
}
const User = mongoose.model("User", userSchema);

module.exports = User

