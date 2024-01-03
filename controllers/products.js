const path=require('path');
const root=require('../helper functions/path');
const Product = require('../models/product');

exports.getAddProducts=(req,res,next)=>{
    res.sendFile(path.join(root,'views','addProduct.html'));
}

exports.postAddProducts=(req,res,next)=>{
    const product=new Product(req.body.title);
    product.save();
    console.log(req.body.title);
    res.redirect('/');
}

exports.getProducts=(req,res,next)=>{
    // Product.fetchAll(product=>{
    //     //res.sendFile(path.join(root,'views','shop.html'))
    //     console.log(product);
    // });
    res.sendFile(path.join(root,'views','shop.html'))
};