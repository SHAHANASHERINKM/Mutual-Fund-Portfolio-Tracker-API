
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fundLatestNavSchema = new Schema({
  schemeCode: {
    type: Number,
    ref: 'Fund', // Reference to Funds collection
    required: true,
    unique: true
  },
  nav: {
    type: Number,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FundLatestNav', fundLatestNavSchema);
