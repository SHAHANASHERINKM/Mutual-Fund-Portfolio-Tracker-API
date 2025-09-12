require('dotenv').config();
const mongoose = require('mongoose');

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Models
const User = require('./user');
const Fund = require('./funds');
const Portfolio = require('./portfolio');
const FundLatestNav = require('./fund_latest_nav');
const FundNavHistory = require('./fund_nav_history');

module.exports = {
  User,
  Fund,
  Portfolio,
  FundLatestNav,
  FundNavHistory
};
