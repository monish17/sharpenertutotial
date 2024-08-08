const express = require('express');

const router = express.Router();

const password=require('../controllers/passwsord');

router.post('/forgotpassword',password.forgotpassword);

module.exports=router;
