const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId',shopController.getProduct);

router.get('/cart', shopController.getCart);

router.post('/cart',shopController.postCart);

<<<<<<< HEAD
=======
router.post('/cart-delete-item',shopController.postCartDeleteProduct);

>>>>>>> 1b71c54c9a8c1f520a239041f11928deccd87590
router.get('/orders', shopController.getOrders);

router.get('/checkout', shopController.getCheckout);

module.exports = router;
