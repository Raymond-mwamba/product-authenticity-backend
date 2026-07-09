// Logging middleware
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);

  // Log request completion
  res.on('finish', () => {
    console.log(`[${timestamp}] Response: ${res.statusCode}`);
  });

  next();
};

module.exports = requestLogger;
