require("dotenv").config();
const mongoose = require("mongoose");

module.exports.connectMongoDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected successfully!");
};
