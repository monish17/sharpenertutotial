const Product = require('../models/product');
const cart=require('../models/cart');

exports.getProducts = (req, res, next) => {
<<<<<<< HEAD
  Product.fetchAll()
  .then(([rows])=>{
    res.render('shop/product-list', {
      prods: rows,
      pageTitle: 'All Products',
      path: '/products'
    });
  })
  .catch(err =>{
    console.log(err);
  })
};
exports.getProduct=(req,res,next)=>{
  const prodId=req.params.productId;
  Product.findById(prodId)
    .then(([product])=>{
      res.render('shop/product-detail',{
        product:product[0],
=======
  Product.findAll()
    .then(products =>{
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All-products',
        path: '/products'
    });
    })
    .catch(err => console.log(err));
};
exports.getProduct=(req,res,next)=>{
  const prodId=req.params.productId;
  //Product.findAll({where : {id : prodId}})
  Product.findByPk(prodId)
    .then(product=>{
      res.render('shop/product-detail',{
        product:product,
>>>>>>> 1b71c54c9a8c1f520a239041f11928deccd87590
        pageTitle: product.title,
        path : '/products'
        });
    })
    .catch(err=>{
      console.log(err);
    });
}
exports.getIndex = (req, res, next) => {
<<<<<<< HEAD
  Product.fetchAll()
  .then(([rows,fieldData])=>{
    res.render('shop/index', {
      prods: rows,
      pageTitle: 'Shop',
      path: '/'
    });
  })
  .catch(err =>{
    console.log(err);
  })
};

exports.getCart = (req, res, next) => {
  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'Your Cart'
  });
=======
  Product.findAll()
    .then(products =>{
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
    });
    })
    .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(cart =>{
      return cart
        .getProducts()
        .then(products =>{
          res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: products
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
>>>>>>> 1b71c54c9a8c1f520a239041f11928deccd87590
};

exports.postCart = (req,res,next)=>{
  const prodId= req.body.productId;
<<<<<<< HEAD
  Product.findById(prodId,product =>{
    cart.addProduct(prodId,product.price);
  })
  
  res.redirect('/cart');
=======
  let fetchedCart;
  let newQuantity =1;
  req.user
    .getCart()
    .then(cart =>{
      fetchedCart=cart;
      return cart.getProducts({where : {id : prodId}})
    })
    .then(products =>{
      let product;
      if(products.length > 0){
         product=products[0];
      }
      if(product){
        const oldQuantity=product.cartItems.quantity;
        newQuantity=oldQuantity+1;
        return product;
      }
      return Product.findByPk(prodId)
    })
    .then(product =>{
      return fetchedCart
            .addProduct(product,
              { through:{quantity: newQuantity}
            });
    })
    .then(()=>{
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
}

exports.postCartDeleteProduct =(req,res,next)=>{
  const prodId=req.body.productId;
  req.user
    .getCart()
    .then(cart =>{
      return cart.getProducts({where :{id:prodId}});
    })
    .then(products =>{
      const product=products[0];
      console.log(products[0]);
      return product.cartItems.destroy();
    })
    .then(result =>{
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
  
>>>>>>> 1b71c54c9a8c1f520a239041f11928deccd87590
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
