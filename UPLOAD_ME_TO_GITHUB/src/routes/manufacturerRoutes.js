const express = require('express');
const router = express.Router();
const manufacturerController = require('../controllers/manufacturerController');

// GET - All manufacturers
router.get('/', manufacturerController.getAllManufacturers);

// GET - Manufacturer by ID
router.get('/:id', manufacturerController.getManufacturerById);

// POST - Create manufacturer
router.post('/', manufacturerController.createManufacturer);

// PUT - Update manufacturer
router.put('/:id', manufacturerController.updateManufacturer);

module.exports = router;
