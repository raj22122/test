const mongoose = require('mongoose');

// Define the User schema
const transactionSchema = new mongoose.Schema({
  userId: {
    type: Object,
    required: true,
  },
  item: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

// Create the User model
const User = mongoose.model('Transaction', transactionSchema);

// Export the User model
module.exports = User;
