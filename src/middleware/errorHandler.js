// src/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  console.error(err.stack);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error = {
      statusCode: 400,
      message: `Resource not found with id of ${err.value}`
    };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    error = {
      statusCode: 400,
      message: 'Duplicate field value entered'
    };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    error = {
      statusCode: 400,
      message: Object.values(err.errors).map(val => val.message).join(', ')
    };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};
  
module.exports = errorHandler;
  