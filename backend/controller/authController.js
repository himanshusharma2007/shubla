const User = require("../model/userModel");
const {checkAuth} = require("../middleware/checkAuth");

const register = async (req, res) => {
    try {
        console.log('req.body in register', req.body)
        const { name, email, password } = req.body;
        if(!name || !email || !password) throw new Error("All fields are required");
        const user = await User.create({ name, email, password });
        const token = await user.generateAuthToken();
        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 600000 *6 *24), // 10 minutes
        });
        if(!token) throw new Error("Failed to generate token");
        res.status(201).json({ user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        console.log('login func called req.body', req.body)
        const { email, password } = req.body;
        if(!email || !password) throw new Error("All fields are required");
        const user = await User.findOne({ email }).select("+password");
        if(!user) throw new Error("User not found");
        const isMatch = await user.comparePassword(password);
        if(!isMatch) throw new Error("Invalid credentials");
        const token = await user.generateAuthToken();
        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 600000 *6 *24), // 10 minutes
        });
        if(!token) throw new Error("Failed to generate token");
        res.status(200).json({ user });
    } catch (error) {
        console.log('error in login', error)
        res.status(400).json({ error: error.message });
    }
};
const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logged out" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { register, login, logout };