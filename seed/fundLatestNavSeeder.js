
const axios = require('axios');
const db = require('../server/models/database');
const Fund = require('../server/models/funds');
const FundLatestNav = require('../server/models/fund_latest_nav');

async function seedAllLatestNavs() {
  try {
    // get all schemeCodes from Funds collection
    const funds = await Fund.find({}, { schemeCode: 1, _id: 0 });
    console.log(`Found ${funds.length} funds in DB`);

    for (const f of funds) {
      const schemeCode = f.schemeCode;
      try {
        console.log(`Fetching latest NAV for schemeCode: ${schemeCode}`);

        const response = await axios.get(`https://api.mfapi.in/mf/${schemeCode}/latest`);
        const latestData = response.data.data?.[0];

        if (!latestData) {
          console.log(` No latest NAV found for ${schemeCode}`);
          continue;
        }

        await FundLatestNav.updateOne(
          { schemeCode },
          {
            $set: {
              nav: parseFloat(latestData.nav),
              date: latestData.date,   // keep as "DD-MM-YYYY"
              updatedAt: new Date()
            }
          },
          { upsert: true }
        );

        console.log(` Latest NAV updated for schemeCode: ${schemeCode}`);
      } catch (innerErr) {
        console.error(`Failed for schemeCode ${schemeCode}:`, innerErr.message);
      }
    }

    console.log(" All latest NAVs seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("Seeder Error:", error.message);
    process.exit(1);
  }
}

// Run seeder
seedAllLatestNavs();
