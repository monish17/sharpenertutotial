const express = require('express');

const userAuthenticate=require('../Middleware/Authenthicate');

const router = express.Router();

const premium=require('../controllers/premium');




router.get('/leadershipBoard',userAuthenticate.authenticate,premium.getLeadershipBoard);

module.exports=router;