
require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const Fund = require('./server/models/funds'); 


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Error:", err));

async function seedFunds() {
  try {
    console.log("Fetching funds from external API...");
    const response = await axios.get('https://api.mfapi.in/mf');
    const fundsList = response.data;

    console.log(`Fetched ${fundsList.length} funds`);

    for (const fund of fundsList) {
      await Fund.updateOne(
        { schemeCode: fund.schemeCode }, // match existing
        {
          schemeCode: fund.schemeCode,
          schemeName: fund.schemeName,
          isinGrowth: "",
          isinDivReinvestment: "",
          fundHouse: "",
          schemeType: "",
          schemeCategory: ""
        },
        { upsert: true } // insert if not exists
      );
    }

    console.log("Funds collection updated successfully ");
    process.exit();
  } catch (err) {
    console.error("Seeding Error:", err.message);
    process.exit(1);
  }
}

seedFunds();
