const mongoose = require("mongoose");

const connectDB = async (url) => {
    try {
        console.log('url', url)
        await mongoose.connect(url);
        console.log("DB connected");
    } catch (error) {
        console.log(error);
    }    
}    

module.exports = connectDB