const express = require('express');

const router = express.Router();

const controller = require('../controller/controller');

router.post('/post-data',controller.postData);

module.exports = router;