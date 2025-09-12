const cron = require('node-cron');
const db = require('../server/models/database');
const Portfolio = require('../server/models/portfolio');
const { fetchLatestNAV, updateLatestNAV, addNAVHistory } = require('../server/utils/navUpdater');

const updateNavJob = cron.schedule('0 0 * * *', async () => {
  console.log('🌙 Starting daily NAV update at 12:00 AM IST...');
  
  try {
   
    const portfolioSchemes = await Portfolio.distinct('schemeCode');

    for (const schemeCode of portfolioSchemes) {
      const latestNav = await fetchLatestNAV(schemeCode);

      if (latestNav) {
        await updateLatestNAV(schemeCode, latestNav);
        await addNAVHistory(schemeCode, latestNav);
        console.log(` Updated NAV for schemeCode ${schemeCode}`);
      }
    }

    console.log('NAV update completed successfully');
  } catch (error) {
    console.error(' NAV update failed:', error);
   
  }
}, { timezone: "Asia/Kolkata" }); 

module.exports = updateNavJob;
