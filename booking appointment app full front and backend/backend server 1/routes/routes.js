
const express = require('express');

const router = express.Router();

const controller = require('../controller/controller');


router.post('/post-data',controller.postData);

router.get('/retrieveData',controller.retrieveData);

router.delete('/deleteData/:email',controller.deleteData);

module.exports = router;