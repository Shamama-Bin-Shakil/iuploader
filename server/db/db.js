const mongoose = require("mongoose");
const URL = process.env.DB_URL;
const connectDB = () => {
    mongoose.connect(URL, () => {
        console.log("CONNECTION SUCCESSFULLY");
    })
}
module.exports = connectDB;