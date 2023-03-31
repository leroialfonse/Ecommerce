const { Router } = require('express');
const cartController = require('../controllers/cartController');
const router = Router();

//Go get all the items in the cart belonging to the user id'd by id.
router.get('/cart/:id', cartController.getCartItems);
//Add an item into the cart of the id'd user.
router.push('/cart/:id', cartController.addCartItem);
//Remove an item from the cart. Be sure that it's an item added by that user, and that we've idetnified the item by it's id. userId and itemId are passed as params.
router.delete('/cart/:userId/:itemId', cartController.deleteItem);


module.exports = router;
