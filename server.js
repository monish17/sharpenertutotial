const express=require('express');

const app=express();

const adminRouter=require('./Routers/admin');
const shopRouter=require('./Routers/shop');

const bodyparser=require('body-parser');
app.use(bodyparser.urlencoded());
app.use('/admin',adminRouter);
app.use(shopRouter);
app.use((req,res,next)=>{
    res.status(404).send('<h1>Page not Found</h1>');
})
app.listen(3000);