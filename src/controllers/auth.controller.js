const User = require('../models/User.model');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { username, email, password, role, company } = req.body;

  // Input validation
  if (!username || !email || !password || !role || !company) {
    return res.status(400).json({
      success: false,
      error: 'All fields (username, email, password, role, company) are required.'
    });
  }
  // Email format validation
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a valid email address.'
    });
  }
  // Password length validation
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      error: 'Password must be at least 6 characters.'
    });
  }

  try {
    // Create user
    const user = await User.create({
      username,
      email,
      password,
      role,
      company
    });
    sendTokenResponse(user, 201, res);
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key error
      return res.status(400).json({
        success: false,
        error: 'Username or email already exists'
      });
    }
    return next(err);
  }
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body || {};

  // Input validation
  if ((!username && !email) || !password) {
    return res.status(400).json({
      success: false,
      error: 'Please provide username or email and password.'
    });
  }

  // Check for user by username or email
  const user = await User.findOne({
    $or: [
      { username: username || null },
      { email: email || null }
    ]
  }).select('+password');

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User does not exist.'
    });
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      error: 'Incorrect password.'
    });
  }

  sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRE || 30) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.cookie('token', token, options);

  if (statusCode === 201) {
    // Registration: simple response
    return res.status(statusCode).json({
      success: true,
      message: 'Registration successful'
    });
  }

  // Login: send token and user details
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      company: user.company
    }
  });
};
