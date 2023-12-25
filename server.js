
const express=require('express');

const app=express();
app.use((req,res,next)=>{
    console.log('this is a middleware function');
    next()
})
app.use((req,res,next)=>{
    console.log("another middleware");
    res.send('<h1>hello everyone!</h1>');
})
app.listen(3000);