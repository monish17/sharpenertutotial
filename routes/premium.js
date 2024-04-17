const express = require('express');

const userAuthenticate=require('../Middleware/Authenthicate');

const router = express.Router();

const premium=require('../controllers/premium');

const controller = require('../controllers/controllers');

const purchase=require('../controllers/purchase');


router.get('/leadershipBoard',userAuthenticate.authenticate,premium.getLeadershipBoard);

module.exports=router;