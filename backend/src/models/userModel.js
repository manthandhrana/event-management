const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import the uuid package

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4, // Generate a UUID for the id field
      unique: true, // Ensure uniqueness
      required: true,
    },
    username: 
    { type: String,
       required: true,
       unique:[true,"Username Already Exist"]
    },
    age: { type: Number, required: true },
    hobbies: { type: [String], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
