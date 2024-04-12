const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const baseUrl = process.env.DB_URL || '0.0.0.0:27017';


const connectUsingMongoose = async () => {
    try {
        await mongoose.connect(`mongodb://${baseUrl}/blogs` );
        console.log("MongoDB connected using mongoose");
    } catch (err) {
        console.log("MongoDB connection failed");
        console.log(err);
    }
}


// export  connectUsingMongoose;
module.exports = { connectUsingMongoose };