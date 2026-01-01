const asyncHandler = require('../middlewares/asyncHandler');
const authService = require('../services/auth.service');

const register = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);
  res.status(201).json({
    message: 'User registered successfully',
    user,
  });
});

const login = asyncHandler(async (req, res) => {
  const data = await authService.loginUser(req.body);
  res.status(200).json(data);
});

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

module.exports = {
  register,
  login,
  getMe,
};
