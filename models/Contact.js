const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true
  },
  value: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('profile', ContactSchema);
