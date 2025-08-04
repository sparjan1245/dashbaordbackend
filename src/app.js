const express = require('express');
const app = express();

const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const errorHandler = require('./middleware/errorHandler');

// Route files
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const moduleRoutes = require("./routes/module.routes");
const fieldRoutes = require('./routes/field.routes');

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Set security headers
app.use(helmet());
// Allow CORS from your frontend
app.use(cors({
  origin: "*", // For dev, or use specific domain like "https://yourfrontend.onrender.com"
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Body parser
app.use(express.json());

// Sanitize data

// Prevent XSS attacks

// Prevent http param pollution
app.use(hpp());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100
});
app.use(limiter);

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5173', // must match your frontend origin exactly
  credentials: true
}));

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use("/api/v1/modules", moduleRoutes);
app.use("/api/v1/modules", fieldRoutes);

// Error handler middleware
app.use(errorHandler);

module.exports = app;
