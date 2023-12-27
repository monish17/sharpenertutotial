const express=require('express');

const app=express();

const adminRouter=require('./Project/admin1');
const appRouter=require('./Project/app');

const bodyparser=require('body-parser');
app.use(bodyparser.urlencoded());
app.use('/admin1',adminRouter);
app.use(appRouter);

app.use((req,res,next)=>{
    res.status(404).send('<h1>Page not Found</h1>');
})
app.listen(4000);