const express = require('express');

const userAuthenticate=require('../Middleware/Authenthicate');

const router = express.Router();

const controller = require('../controllers/controllers');


router.post('/SignUpData',controller.SignUpData);

router.post('/SignInData',controller.SignInData);

router.post('/postData',userAuthenticate.authenticate,controller.postData);

router.get('/retrieveData',userAuthenticate.authenticate,controller.retrieveData);

router.delete('/deleteData/:hiddenIdValue',controller.deleteData);

module.exports = router;