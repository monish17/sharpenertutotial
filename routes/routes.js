const express = require('express');

const router = express.Router();

const controller = require('../controllers/controllers');

router.post('/SignUpData',controller.SignUpData);

router.post('/SignInData',controller.SignInData);

module.exports = router;