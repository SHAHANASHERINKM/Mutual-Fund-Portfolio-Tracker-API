const rateLimit = require("express-rate-limit");
const { ipKeyGenerator } = require("express-rate-limit"); 

// Login attempts: 5 per minute per IP
const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many login attempts. Please try again after a minute."
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: ipKeyGenerator
});

// General API calls: 100 per minute per user
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests. Please slow down."
  },
  keyGenerator: (req, res) => req.user ? req.user.id : ipKeyGenerator(req, res)
});

//  Portfolio updates: 10 per minute per user
const portfolioLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many portfolio updates. Please try again later."
  },
  keyGenerator: (req, res) => req.user ? req.user.id : ipKeyGenerator(req, res)
});

module.exports = { loginLimiter, apiLimiter, portfolioLimiter };
