const Manufacturer = require('../models/Manufacturer');

// Get All Manufacturers
exports.getAllManufacturers = async (req, res) => {
  try {
    const manufacturers = await Manufacturer.getAll();

    res.status(200).json({
      status: 'success',
      data: manufacturers,
      count: manufacturers.length,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Get Manufacturer by ID
exports.getManufacturerById = async (req, res) => {
  try {
    const { id } = req.params;
    const manufacturer = await Manufacturer.findById(id);

    if (!manufacturer) {
      return res.status(404).json({
        status: 'error',
        message: 'Manufacturer not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: manufacturer,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Create Manufacturer
exports.createManufacturer = async (req, res) => {
  try {
    const { name, contact_info } = req.body;

    if (!name) {
      return res.status(400).json({
        status: 'error',
        message: 'Manufacturer name is required',
      });
    }

    const manufacturerId = await Manufacturer.create({
      name,
      contact_info,
    });

    res.status(201).json({
      status: 'success',
      data: { id: manufacturerId },
      message: 'Manufacturer created successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Update Manufacturer
exports.updateManufacturer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact_info } = req.body;

    const updated = await Manufacturer.update(id, { name, contact_info });

    if (!updated) {
      return res.status(404).json({
        status: 'error',
        message: 'Manufacturer not found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Manufacturer updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};
