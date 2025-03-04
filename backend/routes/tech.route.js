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

// Middleware
router.use(authToken);

// Root w/o authRole
router.get('/', (req, res, next) => {
  const allowedRoles = process.env.AUTH_ROLE.split('||').map((role) =>
    role.trim(),
  );
  if (!allowedRoles.includes(req.user.role)) {
    return getPublishedTech(req, res, next);
  }
  return getAllTech(req, res, next);
});

// Publishing route w/o authRole
router.get('/published', getPublishedTech);

// dynamic routes w/o authRole
router.get('/:_id', getTech);

// Middelware
router.use(authRole());

// Root routes
router.post('/', addTech);
router.put('/:_id', updateTech);
router.delete('/', deleteMultipleTech);

// Publishing routes
router.put('/publish/:_id', publishTech);

// dynamic routes
router.delete('/:_id', deleteTech);

module.exports = router;
