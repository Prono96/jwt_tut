require('dotenv').config()
const mongoose = require('mongoose');

// Connecting to mongoDB 
const url = process.env.MONGODB_URI // mongoDB connection URL save in .env file
const conDB = async() => {
  try {
    const connectDB = await mongoose.connect(url);
    if(connectDB){
      console.log("connected to the database");
    } else {
      console.log(error => error);
    }
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
}

module.exports = conDB;