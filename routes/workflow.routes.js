const { sendReminders } = require('../controllers/workflow.controller');
const express = require('express');
const router = express.Router();

//Express handler that wraps the Upstash workflow
router.post('/subscription/reminder', (req, res) => {
  sendReminders(req, res);
});

module.exports = router;
