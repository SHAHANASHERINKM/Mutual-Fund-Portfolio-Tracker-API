const db = require('../models/database'); // import all models
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



module.exports = {
  home: async (req, res) => {
    res.send("API is running at port 5000");
  },

 signup: async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 📌 1. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // 📌 2. Check if user already exists
    const existingUser = await db.User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // 📌 3. Validate password
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          'Password must be at least 8 characters long, include 1 uppercase, 1 lowercase, 1 number, and 1 special character.'
      });
    }

    // 📌 4. Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 📌 5. Create user
    const user = await db.User.create({ name, email, passwordHash });

    // 📌 6. Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // 📌 7. Response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
},

   login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await db.User.findOne({ email });
      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid email or password' });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid email or password' });
      }

      // Generate JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

      // Respond with user info and token
      res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },


getFunds: async (req, res) => {
  try {
    let { search, page, limit } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 20;
    const skip = (page - 1) * limit;

    // 🔎 Search filter
    let filter = {};
    if (search) {
      filter = {
        $or: [
          { schemeName: { $regex: search, $options: 'i' } },
          { fundHouse: { $regex: search, $options: 'i' } }
        ]
      };
    }

    // Count total funds
    const totalFunds = await db.Fund.countDocuments(filter);

    // Fetch funds with pagination
    const funds = await db.Fund.find(filter)
      .skip(skip)
      .limit(limit)
      .select("schemeCode schemeName fundHouse schemeType schemeCategory");

    // Pagination metadata
    const totalPages = Math.ceil(totalFunds / limit);

    res.status(200).json({
      success: true,
      data: {
        funds,
        pagination: {
          currentPage: page,
          totalPages,
          totalFunds,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error("Get Funds Error:", error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
},

addPortfolio: async (req, res) => {
  try {
    const { schemeCode, units } = req.body;
    const userId = req.userId; // set by JWT middleware

    if (!schemeCode || !units) {
      return res.status(400).json({
        success: false,
        message: 'schemeCode and units are required'
      });
    }

    // Check if fund exists
    const fund = await db.Fund.findOne({ schemeCode });
    if (!fund) {
      return res.status(404).json({ success: false, message: 'Invalid schemeCode' });
    }

    // Create portfolio entry
    const portfolio = await db.Portfolio.create({
      userId,
      schemeCode,
      units,
      purchaseDate: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Fund added to portfolio successfully',
      portfolio: {
        id: portfolio._id,
        schemeCode: portfolio.schemeCode,
        schemeName: fund.schemeName,
        units: portfolio.units,
        addedAt: portfolio.createdAt
      }
    });
  } catch (error) {
    console.error("Add Portfolio Error:", error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
},

getPortfolioValue: async (req, res) => {
  try {
    const userId = req.userId; // from JWT

    // Fetch user portfolio
    const portfolio = await db.Portfolio.find({ userId });

    if (!portfolio || portfolio.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalInvestment: 0,
          currentValue: 0,
          profitLoss: 0,
          profitLossPercent: 0,
          asOn: null,
          holdings: []
        }
      });
    }

    let totalInvestment = 0;
    let currentValue = 0;
    let latestDate = null;
    const holdings = [];

    for (const p of portfolio) {
      // Fund info
      const fund = await db.Fund.findOne({ schemeCode: p.schemeCode });
      // Latest NAV
      const latestNav = await db.FundLatestNav.findOne({ schemeCode: p.schemeCode });

      if (!fund || !latestNav) continue;

      const purchaseNav = p.purchaseNav || latestNav.nav; // fallback if not stored
      const investedValue = p.units * purchaseNav;
      const currValue = p.units * latestNav.nav;
      const profitLoss = currValue - investedValue;

      totalInvestment += investedValue;
      currentValue += currValue;

      latestDate = latestNav.date;

      holdings.push({
        schemeCode: p.schemeCode,
        schemeName: fund.schemeName,
        units: p.units,
        currentNav: latestNav.nav,
        currentValue: parseFloat(currValue.toFixed(2)),
        investedValue: parseFloat(investedValue.toFixed(2)),
        profitLoss: parseFloat(profitLoss.toFixed(2))
      });
    }

    const profitLoss = currentValue - totalInvestment;
    const profitLossPercent = totalInvestment > 0 ? (profitLoss / totalInvestment) * 100 : 0;

    res.status(200).json({
      success: true,
      data: {
        totalInvestment: parseFloat(totalInvestment.toFixed(2)),
        currentValue: parseFloat(currentValue.toFixed(2)),
        profitLoss: parseFloat(profitLoss.toFixed(2)),
        profitLossPercent: parseFloat(profitLossPercent.toFixed(3)),
        asOn: latestDate,
        holdings
      }
    });
  } catch (error) {
    console.error("Portfolio Value Error:", error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
},

getPortfolioHistory: async (req, res) => {
  try {
    const userId = req.userId; // from JWT
    const { startDate, endDate } = req.query;

    // Get all user holdings
    const portfolio = await db.Portfolio.find({ userId });
    if (!portfolio || portfolio.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Calculate investment value (fixed)
    let totalInvestment = 0;
    for (const p of portfolio) {
      const navHistory = await db.FundNavHistory.findOne({
        schemeCode: p.schemeCode,
        date: p.purchaseDate.toISOString().slice(0, 10).split("-").reverse().join("-")
      });
      const purchaseNav = navHistory ? parseFloat(navHistory.nav) : 0;
      totalInvestment += p.units * purchaseNav;
    }

    // Date range
    const today = new Date();
    const start = startDate
      ? startDate
      : new Date(today.setDate(today.getDate() - 30)).toISOString().slice(0, 10).split("-").reverse().join("-");
    const end = endDate
      ? endDate
      : new Date().toISOString().slice(0, 10).split("-").reverse().join("-");

    // Fetch NAV history for each holding in range
    let historyResult = {};

    for (const p of portfolio) {
      const navHistory = await db.FundNavHistory.find({
        schemeCode: p.schemeCode,
        date: { $gte: start, $lte: end }
      });

      navHistory.forEach(record => {
        const date = record.date;
        const holdingValue = p.units * record.nav;

        if (!historyResult[date]) {
          historyResult[date] = { totalValue: 0 };
        }

        historyResult[date].totalValue += holdingValue;
      });
    }

    // Format response
    const data = Object.entries(historyResult).map(([date, val]) => ({
      date,
      totalValue: parseFloat(val.totalValue.toFixed(2)),
      profitLoss: parseFloat((val.totalValue - totalInvestment).toFixed(2))
    }));

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Portfolio History Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
},

getPortfolioList: async (req, res) => {
  try {
    const userId = req.userId; // from JWT
    console.log("User ID:", userId);

    // Fetch user portfolio
    const portfolio = await db.Portfolio.find({ userId });
    console.log("Portfolio entries found:", portfolio.length);

    if (!portfolio || portfolio.length === 0) {
      return res.status(200).json({
        success: true,
        data: { totalHoldings: 0, holdings: [] }
      });
    }

    const holdings = [];
    for (const p of portfolio) {
      const fund = await db.Fund.findOne({ schemeCode: p.schemeCode });
      const latestNav = await db.FundLatestNav.findOne({ schemeCode: p.schemeCode });

      if (!fund) {
        holdings.push({
          schemeCode: p.schemeCode,
          schemeName: "Unknown Fund",
          units: p.units,
          currentNav: null,
          currentValue: null,
          note: "Fund details not found"
        });
        continue;
      }

      if (!latestNav) {
        holdings.push({
          schemeCode: p.schemeCode,
          schemeName: fund.schemeName,
          units: p.units,
          currentNav: null,
          currentValue: null,
          note: "Latest NAV not available"
        });
        continue;
      }

      // Both fund + NAV exist → calculate value
      const currentValue = p.units * latestNav.nav;

      holdings.push({
        schemeCode: p.schemeCode,
        schemeName: fund.schemeName,
        units: p.units,
        currentNav: latestNav.nav,
        currentValue: parseFloat(currentValue.toFixed(2))
      });
    }

    res.status(200).json({
      success: true,
      data: {
        totalHoldings: holdings.length,
        holdings
      }
    });
  } catch (error) {
    console.error("Portfolio List Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
},

 removePortfolio: async (req, res) => {
  try {
    const userId = req.userId; // JWT middleware attaches this
    const { schemeCode } = req.params;

    // remove one holding by schemeCode for this user
    const deleted = await db.Portfolio.findOneAndDelete({ userId, schemeCode });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Fund not found in portfolio"
      });
    }

    res.status(200).json({
      success: true,
      message: "Fund removed from portfolio successfully"
    });
  } catch (error) {
    console.error("Remove Portfolio Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
},

getFundNavHistory: async (req, res) => {
  try {
    const { schemeCode } = req.params;

    // find fund details
    const fund = await db.Fund.findOne({ schemeCode });
    if (!fund) {
      return res.status(404).json({
        success: false,
        message: "Fund not found"
      });
    }

    // get latest NAV
    const latestNav = await db.FundLatestNav.findOne({ schemeCode });

    // get last 30 days history
    const history = await db.FundNavHistory.find({ schemeCode })
      .sort({ createdAt: -1 }) // latest first
      .limit(30);

    const responseHistory = history.map(h => ({
      date: h.date,
      nav: h.nav
    }));

    res.status(200).json({
      success: true,
      data: {
        schemeCode: fund.schemeCode,
        schemeName: fund.schemeName,
        currentNav: latestNav ? latestNav.nav : null,
        asOn: latestNav ? latestNav.date : null,
        history: responseHistory
      }
    });
  } catch (error) {
    console.error("Fund NAV History Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
}










};
