
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fundSchema = new Schema({
  schemeCode: {
    type: Number,
    required: true,
    unique: true
  },
  schemeName: {
    type: String,
    required: true
  },
  isinGrowth: {
    type: String,
    required: true
  },
  isinDivReinvestment: {
    type: String,
    required: true
  },
  fundHouse: {
    type: String,
    required: true
  },
  schemeType: {
    type: String
  },
  schemeCategory: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Fund', fundSchema);
