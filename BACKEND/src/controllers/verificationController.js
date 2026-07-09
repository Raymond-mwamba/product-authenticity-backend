const Verification = require('../models/Verification');
const Product = require('../models/Product');
const VerificationService = require('../services/VerificationService');

// Verify Product
exports.verifyProduct = async (req, res) => {
  try {
    const { unique_code, channel = 'app', location = '' } = req.body;

    if (!unique_code) {
      return res.status(400).json({
        status: 'error',
        message: 'Product code is required',
      });
    }

    const result = await VerificationService.verifyProduct(
      unique_code,
      channel,
      location
    );

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      status: 'error',
      message: error.message,
      code: error.code,
    });
  }
};

// Get All Verifications
exports.getAllVerifications = async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const verifications = await Verification.getAll(
      parseInt(limit),
      parseInt(offset)
    );

    res.status(200).json({
      status: 'success',
      data: verifications,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Get Verification by ID
exports.getVerificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const verification = await Verification.findById(id);

    if (!verification) {
      return res.status(404).json({
        status: 'error',
        message: 'Verification not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: verification,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Get Verification Statistics
exports.getStatistics = async (req, res) => {
  try {
    const stats = await VerificationService.getStatistics();

    res.status(200).json({
      status: 'success',
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};
