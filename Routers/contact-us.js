const express=require('express');
const path=require('path');
const root=require('../helper functions/path');
const productsController=require('../controllers/contact');
const router=express.Router();

router.get('/contactus',productsController.contactus);
router.get('/success',productsController.success);
module.exports=router;