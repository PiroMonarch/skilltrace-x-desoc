const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const integrationController = require('../controllers/integrationController');

router.post('/connect', requireAuth, requireRole('DEVELOPER'), integrationController.connectProvider);

module.exports = router;
