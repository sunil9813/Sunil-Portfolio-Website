const { NODE_ENV } = require("../utils/variables");

const NotFound = (req, res, next) => {
  const error = new Error(`Not Found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const ErrorHanlder = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  res.status(statusCode);
  res.json({
    error: err.message,
    stack: NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { NotFound, ErrorHanlder };
