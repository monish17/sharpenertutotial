const express=require('express');
const path=require('path');

const app=express();

const adminRouter=require('./Routers/admin');
const appRouter=require('./Routers/shop');
const contact=require('./Routers/contact-us');

const bodyparser=require('body-parser');
app.use(bodyparser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));
app.use('/admin1',adminRouter);
app.use(appRouter);
app.use(contact);

app.use((req,res,next)=>{
    res.status(404).sendFile(path.join(__dirname,'views','pageNotFound.html'));
})
app.listen(4000);