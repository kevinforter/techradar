const express = require('express');
const router = express.Router();

const {
  register,
  login,
  logout,
  getToken,
} = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.delete('/logout', logout);
router.post('/token', getToken);

module.exports = router;
