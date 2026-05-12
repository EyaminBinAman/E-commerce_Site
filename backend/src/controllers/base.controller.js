const getBaseInfo = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Practice E-Commerce API v1",
    version: "v1",
  });
};

const getHealthStatus = (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
    version: "v1",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  getBaseInfo,
  getHealthStatus,
};
