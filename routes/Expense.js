const express = require('express');

const router = express.Router();

const userAuthenticate=require('../Middleware/Authenthicate');

const ExpenseReport=require('../controllers/ExpenseReport');

router.get('/ExpenseReport',userAuthenticate.authenticate,ExpenseReport.ExpenseReport);

module.exports=router;