const path=require('path');
const root=require('../helper functions/path');
exports.getAddProducts=(req,res,next)=>{
    res.sendFile(path.join(root,'views','addProduct.html'));
}

exports.postAddProducts=(req,res,next)=>{
    console.log(req.body);
    res.redirect('/');
}

exports.getProducts=(req,res,next)=>{
    res.sendFile(path.join(root,'views','shop.html'))
}