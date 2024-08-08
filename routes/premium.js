const express = require('express');

const userAuthenticate=require('../Authentication/Authenticate');

const router = express.Router();

const premium=require('../controllers/premium');

router.get('/leadershipBoard',userAuthenticate.authenticate,premium.getLeadershipBoard);

module.exports = router;