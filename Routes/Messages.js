const express = require('express');

const router=express.Router();

const Authenticate=require('../Authentication/Authenticate');

const Messages=require('../Controllers/Messages');

router.post('/postMessage',Authenticate.authenticate,Messages.MessageStoring);

module.exports = router;