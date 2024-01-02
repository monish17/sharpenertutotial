const express=require('express');
const productsController=require('../controllers/products');
const router=express.Router();

router.get('/Add-products',productsController.getAddProducts);
router.post('/Add-products',productsController.postAddProducts);
module.exports = router;