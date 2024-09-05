const express = require('express');

const router=express.Router();

const controller = require('../Controllers/Controller');

router.post('/SignUpData',controller.SignUpData);

module.exports = router;