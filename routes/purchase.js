const express = require('express');

const userAuthenticate=require('../Authentication/Authenticate');

const router = express.Router();

//const controller = require('../controllers/controllers');

const purchase=require('../controllers/purchase');

router.get('/premiummembership',userAuthenticate.authenticate,purchase.premiummembership);

router.post('/updateTransactionStatus',userAuthenticate.authenticate,purchase.updateTransactionStatus);



module.exports = router;