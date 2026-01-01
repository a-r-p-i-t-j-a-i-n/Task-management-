const asyncHandler = require('../middlewares/asyncHandler');
const { getAllUsersService, deleteUserService } = require('../services/user.service');
const { registerUser } = require('../services/auth.service'); // Reuse auth service

exports.getUsers = asyncHandler(async (req, res) => {
    const users = await getAllUsersService();
    res.json({ success: true, users });
});

exports.createUser = asyncHandler(async (req, res) => {
    const user = await registerUser(req.body);
    res.status(201).json({ success: true, user });
});

exports.deleteUser = asyncHandler(async (req, res) => {
    await deleteUserService(req.params.id);
    res.json({ success: true, message: 'User deleted' });
});
