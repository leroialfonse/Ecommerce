const { Router } = require('express');
const orderController = require('../controllers/orderController');
const router = Router();

// Go get the orders by userId
router.get('order/:id', orderController.getOrder);

// Checking an order out.
router.post('order/:id', orderController.checkoutOrder);

module.exports = router;