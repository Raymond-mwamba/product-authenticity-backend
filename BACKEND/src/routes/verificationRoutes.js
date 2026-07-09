const express = require('express');
const router = express.Router();
const verificationController = require('../controllers/verificationController');

// POST - Verify a product
router.post('/verify', verificationController.verifyProduct);

// GET - Statistics
router.get('/stats/overview', verificationController.getStatistics);

// GET - All verifications
router.get('/', verificationController.getAllVerifications);

// GET - Verification by ID
router.get('/:id', verificationController.getVerificationById);

module.exports = router;
