// Request validation middleware
const validateVerifyRequest = (req, res, next) => {
  const { unique_code, channel } = req.body;

  if (!unique_code || typeof unique_code !== 'string') {
    return res.status(400).json({
      status: 'error',
      message: 'Valid unique_code is required',
    });
  }

  if (channel && !['app', 'ussd'].includes(channel)) {
    return res.status(400).json({
      status: 'error',
      message: 'Channel must be either "app" or "ussd"',
    });
  }

  next();
};

module.exports = {
  validateVerifyRequest,
};
