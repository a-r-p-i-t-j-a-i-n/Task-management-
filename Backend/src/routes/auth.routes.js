const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');

const protect = require('../middlewares/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, require('../controllers/auth.controller').getMe);

module.exports = router;
