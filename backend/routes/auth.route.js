const express = require('express');
const router = express.Router();

const {
  register,
  login,
  logout,
  token,
} = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.delete('/logout', logout);
router.get('/token', token);

module.exports = router;
