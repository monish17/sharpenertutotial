const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing:false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
<<<<<<< HEAD
  const product = new Product(null,title, imageUrl, description, price);
  product.save()
  .then(()=>{
    res.redirect('/');
=======
  req.user
    .createProduct({
    title:title,
    price:price,
    imageUrl : imageUrl,
    description: description
  })
  .then(result =>{
    res.redirect('/products')
    console.log(result);
>>>>>>> 1b71c54c9a8c1f520a239041f11928deccd87590
  })
  .catch(err =>{
    console.log(err);
  })
};

exports.getEditProduct = (req, res, next) => {
  const editMode=req.query.edit;
  if(!editMode){
    return res.redirect('/');
  }
  const prodId=req.params.productId;
<<<<<<< HEAD
  Product.findById(prodId,product=>{
    if(!product){
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product:product
    });
  }); 
=======
  req.user.getProducts({where : {id : prodId}})
    .then(products =>{
      const product=products[0];
      if(!product){
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product:product
      });
  })
    .catch(err => console.log(err));
>>>>>>> 1b71c54c9a8c1f520a239041f11928deccd87590
};
exports.postEditProduct=(req,res,next)=>{
  const prodId=req.body.productId;
  const updatedTitle=req.body.title;
  const updatedPrice=req.body.price;
  const updatedDesc=req.body.description;
  const updatedImageUrl=req.body.imageUrl;
<<<<<<< HEAD
  const updatedProducts=new Product(
    prodId,updatedTitle,updatedImageUrl,updatedDesc,updatedPrice
    );
  updatedProducts.save();
  res.redirect('/products');
}
exports.postDeleteProduct=(req,res,next)=>{
  const prodId=req.body.productId;
  Product.deleteProductById(prodId)
  .then(() => {
    res.redirect('/products');
  })
  .catch(error => {
    console.error(error);
    res.status(500).send('Internal Server Error');
  });
}
exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([rows])=>{
      res.render('admin/products', {
        prods: rows,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err =>{
      console.log(err);
    })
  
=======
  Product.findByPk(prodId)
    .then(product =>{
      product.title=updatedTitle;
      product.price=updatedPrice;
      product.description=updatedDesc;
      product.imageUrl=updatedImageUrl;
      return product.save()
    })
    .then(result =>{
      res.redirect('/products');
      console.log('Product Updated');
    })
    .catch(err => console.log(err));
}
exports.postDeleteProduct=(req,res,next)=>{
  const prodId=req.body.productId;
  Product.findByPk(prodId)
    .then(product =>{
      return product.destroy()
    })
    .then(result =>{
      res.redirect('/products');
      console.log('Product deleted');
    })
    .catch(err => console.log(err));
}
exports.getProducts = (req, res, next) => {
  req.user.getProducts()
    .then(products =>{
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
    });
    })
    .catch(err => console.log(err));
>>>>>>> 1b71c54c9a8c1f520a239041f11928deccd87590
};
