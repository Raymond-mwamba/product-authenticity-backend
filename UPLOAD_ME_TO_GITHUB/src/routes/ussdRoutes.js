const express = require('express');
const router = express.Router();
const ussdController = require('../controllers/ussdController');

// Callback endpoint for Africa's Talking USSD service
router.post('/callback', ussdController.handleUSSDCallback);

module.exports = router;
