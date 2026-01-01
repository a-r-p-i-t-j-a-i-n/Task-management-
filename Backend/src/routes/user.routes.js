const express = require('express');
const router = express.Router();
const { getUsers, deleteUser } = require('../controllers/user.controller');
const protect = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/', getUsers);
router.post('/', require('../controllers/user.controller').createUser);
router.delete('/:id', deleteUser);

module.exports = router;
