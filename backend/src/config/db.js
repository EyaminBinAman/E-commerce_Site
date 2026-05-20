const mongoose = require("mongoose");
const Brand = require("../models/Brand");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Brand.init();
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
