const express = require('express');

const router=express.Router();

const Authenticate=require('../Authentication/Authenticate');

const Messages=require('../Controllers/Messages');

router.post('/postMessage',Authenticate.authenticate,Messages.MessageStoring);

router.post('/postFiles/:userName/:Group_Id',Authenticate.authenticate,Messages.PostingFiles);

router.get('/getMessage/:lastMessageId/:Group_Id',Authenticate.authenticate,Messages.RetrievingMessage);

router.get('/getOlderMessages/:firstMessageId/:Group_Id',Authenticate.authenticate,Messages.GetOlderMessage);

router.get('/getDynamicMessages/:GROUP_ID',Authenticate.authenticate,Messages.DynamicMessageRetriving);

router.get('/getArchievedMessages/:firstMessageId/:Group_Id',Authenticate.authenticate,Messages.GetArchievedMessages);

router.get('/backUpData',Messages.backupData);


module.exports = router;