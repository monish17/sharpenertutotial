const express=require('express');
const router=express.Router();

router.get('/Add-products',(req,res,next)=>{
    res.send('<form action="/admin/Add-products" method="POST"><input type="text" name="Title"><br><input type="number" name="size"><br><button type="submit">Add Products</button></form>');
})
router.post('/Add-products',(req,res,next)=>{
    console.log(req.body);
    res.redirect('/');
})
module.exports = router;