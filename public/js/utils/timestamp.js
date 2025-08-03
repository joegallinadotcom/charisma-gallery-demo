// Set the "timestamp" variable ONCE on page load
// (for use in Multer config)
module.exports = (req, res, next) => {
  req.timestamp = Date.now();
  next();
};
