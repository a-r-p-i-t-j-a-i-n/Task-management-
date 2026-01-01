const User = require('../models/user.model');

/**
 * Get All Users
 */
exports.getAllUsersService = async () => {
    return await User.find().select('-password');
};

/**
 * Delete User
 */
exports.deleteUserService = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    await user.deleteOne();
};
