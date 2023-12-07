const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Ensure usernames are unique
  },
  designation: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
});

// Create the User model
const User = mongoose.models.User || mongoose.model('User', userSchema);

// Export the User model
module.exports = User;
