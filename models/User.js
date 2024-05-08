const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    trim: true,
    unique: true
  },
  fullName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true
  },
  mobileNumber: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model("User", userSchema);
