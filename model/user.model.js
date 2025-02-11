const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    // required: true,
    default: 'unknown',
  },
  last_name: {
    type: String,
    // required: true,
    default: 'unknown',
  },
  username: {
    type: String,
    // required: true,
    unique: true,
  },
  chatId: {
    type: Number,
    required: true,
    unique: true,
  },
  phone_number: {
    type: String,
    default: 'unknown',
  },
  action: { type: String },
});

module.exports = mongoose.model('User', userSchema);
