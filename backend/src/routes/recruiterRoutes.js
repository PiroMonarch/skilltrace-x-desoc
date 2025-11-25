const express = require('express');
const router = express.Router();
const recruiterController = require('../controllers/recruiterController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/me/profile', requireAuth, requireRole('RECRUITER'), recruiterController.getMyProfile);
router.patch('/me/profile', requireAuth, requireRole('RECRUITER'), recruiterController.updateMyProfile);

router.post('/search', requireAuth, requireRole('RECRUITER'), recruiterController.searchDevelopers);

module.exports = router;
