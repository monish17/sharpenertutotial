const express = require('express');

const router = express.Router();

const userAuthenticate=require('../Authentication/Authenticate');

const ExpenseReport=require('../controllers/expenseReport');

router.get('/ExpenseReport',userAuthenticate.authenticate,ExpenseReport.ExpenseReport);

router.get('/getURL',userAuthenticate.authenticate,ExpenseReport.getURl);

module.exports=router;