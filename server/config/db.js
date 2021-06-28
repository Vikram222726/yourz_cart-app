const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(
      `Successfully Connected to MongoDB at PORT ${process.env.PORT}`
    );
  } catch (ex) {
    console.log("MongoDB connection Failed");
    process.exit(1);
  }
};

module.exports = connectDB;
