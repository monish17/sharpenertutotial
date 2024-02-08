<<<<<<< HEAD
const fs= require('fs');
const path=require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
  );
  
module.exports= class cart{
    static addProduct(id,productPrice){
        fs.readFile(p,(err,fileContent)=>{
            let cart={products:[],totalPrice:0}
            if(!err){
                cart=JSON.parse(fileContent);
            }
            const existingProductIndex=cart.products.findIndex(prod => prod.id===id);
            const existingProduct=cart.products[existingProductIndex];
            let updatedProduct;
            if(existingProduct){
                updatedProduct={...existingProduct};
                updatedProduct.qty=updatedProduct.qty+1
                cart.products=[...cart.products];
                cart.products[existingProductIndex]=updatedProduct;
            }else{
                updatedProduct={id : id, qty : 1};
                cart.products=[...cart.products,updatedProduct];
            }
            cart.totalPrice=cart.totalPrice + +productPrice
            fs.writeFile(p,JSON.stringify(cart), err =>{
                console.log(err);
            })
        })
    }
}
=======
const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Cart = sequelize.define('cart',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey:true
    }
});

module.exports = Cart;
>>>>>>> 1b71c54c9a8c1f520a239041f11928deccd87590
