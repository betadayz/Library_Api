const express = require("express");
const { register, login, getMe  } = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/register', register);
router.get('/login', login);
router.get('/me', protect, getMe);

module.exports = router;