const express = require('express');
const router = express.Router();
const devController = require('../controllers/developerController');
const { requireAuth, requireRole } = require('../middleware/auth');

// dev-only routes
router.get('/me/profile', requireAuth, requireRole('DEVELOPER'), devController.getMyProfile);
router.patch('/me/profile', requireAuth, requireRole('DEVELOPER'), devController.updateMyProfile);
router.get('/me/skill-snapshot', requireAuth, requireRole('DEVELOPER'), devController.getMySkillSnapshot);

// public route
router.get('/public/:username', devController.getPublicProfile);

module.exports = router;
