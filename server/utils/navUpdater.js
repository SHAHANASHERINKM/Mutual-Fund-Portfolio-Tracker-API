
const axios = require('axios');
const db = require('../models/database');
const FundLatestNav = require('../models/fund_latest_nav');
const FundNavHistory = require('../models/fund_nav_history');

async function fetchLatestNAV(schemeCode) {
  try {
    const response = await axios.get(`https://api.mfapi.in/mf/${schemeCode}/latest`);
    const latestData = response.data.data?.[0];
    if (!latestData) return null;

    return {
      schemeCode,
      nav: parseFloat(latestData.nav),
      date: latestData.date
    };
  } catch (err) {
    console.error(`Error fetching NAV for schemeCode ${schemeCode}:`, err.message);
    return null;
  }
}

async function updateLatestNAV(schemeCode, latestNav) {
  if (!latestNav) return;
  await FundLatestNav.updateOne(
    { schemeCode },
    { 
      $set: { 
        nav: latestNav.nav, 
        date: latestNav.date, 
        updatedAt: new Date() 
      } 
    },
    { upsert: true }
  );
}

async function addNAVHistory(schemeCode, latestNav) {
  if (!latestNav) return;
  await FundNavHistory.updateOne(
    { schemeCode, date: latestNav.date },
    { $set: { nav: latestNav.nav, createdAt: new Date() } },
    { upsert: true }
  );
}

module.exports = { fetchLatestNAV, updateLatestNAV, addNAVHistory };
