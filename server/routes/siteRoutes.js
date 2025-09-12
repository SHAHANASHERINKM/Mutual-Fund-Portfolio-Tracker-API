const express = require('express');
const router = express.Router();
const siteController = require('../controller/siteController');
const auth = require('../middleware/auth');
const { loginLimiter, apiLimiter, portfolioLimiter } = require('../middleware/rateLimiter');

router.get('/', siteController.home);
//login and signup routes
router.post('/api/auth/signup', siteController.signup);
router.post('/api/auth/login',loginLimiter,siteController.login);
//Fund routes
router.get('/api/funds', apiLimiter,siteController.getFunds);
router.get('/api/funds/:schemeCode/nav',apiLimiter, siteController.getFundNavHistory);
//portfolio routes
router.post('/api/portfolio/add', auth, portfolioLimiter,siteController.addPortfolio);
router.delete('/api/portfolio/remove/:schemeCode', auth, siteController.removePortfolio);
router.get('/api/portfolio/value', auth,apiLimiter, siteController.getPortfolioValue);
router.get('/api/portfolio/history', auth,apiLimiter, siteController.getPortfolioHistory);
router.get('/api/portfolio/list', auth, apiLimiter,siteController.getPortfolioList);





  module.exports = router;