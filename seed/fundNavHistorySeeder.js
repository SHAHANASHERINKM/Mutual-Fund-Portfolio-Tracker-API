
const axios = require('axios');
const db = require('../server/models/database'); 
const FundNavHistory = require('../server/models/fund_nav_history');

async function seedFundNavHistory(schemeCode) {
  try {
    console.log(`Fetching NAV history for schemeCode: ${schemeCode}`);

    const response = await axios.get(`https://api.mfapi.in/mf/${schemeCode}`);
    const historyData = response.data.data; // API returns array of {date, nav}

    if (!historyData || historyData.length === 0) {
      console.log(`No NAV history found for ${schemeCode}`);
      return;
    }

    for (const record of historyData) {
      await FundNavHistory.updateOne(
        { schemeCode, date: record.date }, // match by scheme + date
        { 
          $set: { 
            nav: parseFloat(record.nav),
            createdAt: new Date()
          } 
        },
        { upsert: true }
      );
    }

    console.log(` NAV history inserted/updated for schemeCode: ${schemeCode}`);
  } catch (error) {
    console.error(`Error fetching NAV history for ${schemeCode}:`, error.message);
  }
}

// Run the seeder for one fund (example: ICICI Bluechip)
seedFundNavHistory(100031)
  .then(() => process.exit())
  .catch(() => process.exit(1));
