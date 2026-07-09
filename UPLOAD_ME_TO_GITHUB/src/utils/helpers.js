// Utility function to generate API response
const apiResponse = (status, data, message = '') => {
  return {
    status,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
};

// Utility function to handle async route errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Utility to format date
const formatDate = (date) => {
  return new Date(date).toLocaleString();
};

module.exports = {
  apiResponse,
  asyncHandler,
  formatDate,
};
