const express = require('express');

const router = express.Router();

const controller = require('../controllers/controllers');

router.post('/SignUpData',controller.SignUpData);

router.post('/SignInData',controller.SignInData);

router.post('/postData',controller.postData);

router.get('/retrieveData',controller.retrieveData);

router.delete('/deleteData/:hiddenIdValue',controller.deleteData);

module.exports = router;