const express=require('express');
const path=require('path');
const root=require('../helper functions/path');
const router=express.Router();

router.get('/Add-products',(req,res,next)=>{
    res.sendFile(path.join(root,'views','addProduct.html'));
})
router.post('/Add-products',(req,res,next)=>{
    console.log(req.body);
    res.redirect('/');
})
module.exports = router;