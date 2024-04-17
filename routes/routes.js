const express = require('express');

const userAuthenticate=require('../Middleware/Authenthicate');

const router = express.Router();

const controller = require('../controllers/controllers');

const purchase=require('../controllers/purchase');

router.post('/SignUpData',controller.SignUpData);

router.post('/SignInData',controller.SignInData);

router.post('/postData',userAuthenticate.authenticate,controller.postData);

router.get('/retrieveData',userAuthenticate.authenticate,controller.retrieveData);

router.delete('/deleteData/:hiddenIdValue',userAuthenticate.authenticate,controller.deleteData);

// router.get('/premiummembership',userAuthenticate.authenticate,purchase.premiummembership);

// router.get('/premiummembership',userAuthenticate.authenticate,purchase.premiummembership);

// router.post('/updateTransactionStatus',userAuthenticate.authenticate,purchase.updateTransactionStatus);

module.exports = router;