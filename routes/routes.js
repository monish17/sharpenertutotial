const express = require('express');

const Authenticate=require('../Authentication/Authenticate');

const router=express.Router();

const controller = require('../controllers/controller');
const expenseReport = require('../controllers/expenseReport');

router.post('/SignUpData',controller.SignUpData);

router.post('/SignInData',controller.SignInData);

router.post('/PostData',Authenticate.authenticate,controller.PostData);

router.get('/retrieveData',Authenticate.authenticate,controller.retrieveData);

router.get('/retrieveExpenseReport',Authenticate.authenticate,controller.retrieveExpenseReport);

router.delete('/deleteData/:hiddenIdValue',Authenticate.authenticate,controller.deleteData);

router.get('/getTotalTransaction',Authenticate.authenticate,controller.getTotalTransaction);

router.get('/Download',Authenticate.authenticate,controller.downloadData);

router.get('/DownloadsHistory',Authenticate.authenticate,expenseReport.getURl);

module.exports = router;