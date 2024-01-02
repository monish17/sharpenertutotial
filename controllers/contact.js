const path=require('path');
const root=require('../helper functions/path');

exports.contactus=(req,res,next)=>{
    res.sendFile(path.join(root,'views','contact.html'));
}

exports.success=(req,res,next)=>{
    res.sendFile(path.join(root,'views','submission.html'));
}