const express = require('express');
const router = express.Router();
const {
  getAllTech,
  getTech,
  getPublishedTech,
  addTech,
  updateTech,
  publishTech,
  deleteTech,
  deleteMultipleTech,
} = require('../controllers/tech.controller');
const { authToken, authRole } = require('../middleware/auth');
require('dotenv').config();

// Root routes
router.get('/', authToken, (req, res, next) => {
  const allowedRoles = process.env.AUTH_ROLE.split('||').map((role) =>
    role.trim(),
  );
  if (!allowedRoles.includes(req.user.role)) {
    return getPublishedTech(req, res, next);
  }
  return getAllTech(req, res, next);
});
router.post('/', authToken, authRole(), addTech);
router.put('/', authToken, authRole(), updateTech);
router.delete('/', authToken, authRole(), deleteMultipleTech);

// Publishing routes
router.get('/published', authToken, getPublishedTech);
router.put('/publish', authToken, authRole(), publishTech);

// dynamic routes
router.get('/:name', authToken, getTech);
router.delete('/:id', authToken, authRole(), deleteTech);

module.exports = router;
