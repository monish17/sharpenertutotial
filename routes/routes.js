const express = require('express');

const router = express.Router();

const controller = require('../controllers/controllers');

router.post('/SignInData',controller.SignInData);

module.exports = router;