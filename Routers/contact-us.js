const express=require('express');
const path=require('path');
const root=require('../helper functions/path');
const router=express.Router();

router.get('/contactus',(req,res,next)=>{
    res.sendFile(path.join(root,'views','contact.html'));
});
router.get('/success',(req,res,next)=>{
    res.sendFile(path.join(root,'views','submission.html'));
})
module.exports=router;