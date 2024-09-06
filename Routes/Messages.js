const express = require('express');

const router=express.Router();

const Authenticate=require('../Authentication/Authenticate');

const Messages=require('../Controllers/Messages');

router.post('/postMessage',Authenticate.authenticate,Messages.MessageStoring);

router.get('/getMessage',Authenticate.authenticate,Messages.RetrievingMessage);

module.exports = router;