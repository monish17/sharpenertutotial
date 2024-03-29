const express = require('express');

const router = express.Router();

const controller = require('../controllers/controllers');

router.post('/SignUpData',controller.SignUpData);

module.exports = router;