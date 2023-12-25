
const express=require('express');

const bodyparser=require('body-parser');

const app=express();
app.use(bodyparser.urlencoded());
app.use('/Add-products',(req,res,next)=>{
    res.send('<form action="/products" method="POST"><input type="text" name="Title"><br><input type="number" name="size"><br><button type="submit">Add Products</button></form>');
})
app.post('/products',(req,res,next)=>{
    console.log(req.body);
    res.redirect('/');
})
app.use('/',(req,res,next)=>{
    res.send('<h1>Product Added!</h1>');
})
app.listen(3000);