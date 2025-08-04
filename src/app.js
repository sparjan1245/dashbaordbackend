const express = require('express');
const app = express();

const morgan = require('morgan');
const cors = require('cors');
app.use(cors({
  origin: ['https://dashbaordfrontend.onrender.com', 'http://localhost:5173'],
  credentials: true
}));

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

// Body parser
app.use(express.json());

// Prevent http param pollution
app.use(hpp());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use("/api/v1/modules", moduleRoutes);
app.use("/api/v1/modules", fieldRoutes);

// Error handler middleware
app.use(errorHandler);

module.exports = app;
