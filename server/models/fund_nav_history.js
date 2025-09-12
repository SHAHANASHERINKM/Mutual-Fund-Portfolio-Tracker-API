
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fundNavHistorySchema = new Schema({
  schemeCode: {
    type: Number,
    ref: 'Fund', // Reference to Funds collection
    required: true
  },
  nav: {
    type: Number,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FundNavHistory', fundNavHistorySchema);
