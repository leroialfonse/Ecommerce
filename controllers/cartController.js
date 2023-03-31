// Need to bring in the cart and item models into the file, in order to do things with them...

const Cart = require('../models/Cart');
const Item = require('../models/Item');

// Fetch all the items in the cart, and display them on the user's frontend.
module.exports.getCart = async (req, res) => {
    const userId = req.params.id;
    try {
        let cart = await Cart.findOne({ userId });
        // check to make sure the cart is populated. if so, send it.
        if (cart && cart.items.length > 0) {
            res.send(cart)
        } else {
            // and if not, send null
            res.send(null);
        }
    }
    // Catch errors, send a status 500, and notify.
    catch (err) {
        console.log(err);
        res.status(500).send('Something went wrong.');
    }
}

module.exports.addItems = async (req, res) => {
    // pull in the user id to match with the cart.
    const userId = req.params.id;
    // pull in the items data
    const { productId, quantity } = req.body;
    try {
        // Go get the cart that matches this user.
        let cart = await Cart.findOne({ userId });
        // How to find the items that exist 
        let item = await Item.findOne({ _id: productId });
        if (!item) {
            // If item is not there, send a 404 and notify.
            res.status(404)('I can\'t find that item!');
        }
        const price = item.price;
        const name = item.title;

        if (cart) {
            // If this user has a cart, then....
            let itemIndex = cart.items.findIndex(prod => prod.productId == productId);
            // And check if the item exists or not. 
            if (itemIndex > -1) {
                let productItem = cart.items[itemIndex];
                productItem.quantity += quantity;
                cart.items[itemIndex] = productItem;
            }
            // if the item does not exist in teh cart, push it into the cart items array. 
            else {
                cart.items.push({ productId, name, quantity, price });

            }
            // Calculate the cost of the cart
            cart.total += (quantity * price);
            cart = await cart.save();
            // send the cart
            return res.status(201).send(cart);

        }
        else {
            //  There is not already a cart, so make one first.
            const newCart = await Cart.create({
                userId,
                items: [{ productId, name, quantity, price }],
                bill: (quantity * price)
            });
            // Send the new cart.
            return res.status(201).send(newCart)
        }
    }
    // Catch errors and notify if something went wrong. 
    catch (err) {
        console.log(err)
        res.status(500).send('Sorry, something went wrong...');
    }
}

module.exports.deleteItem = async (req, res) => {
    // Find the user and product id we want to look at/for
    const userId = req.params.userId;
    const productId = req.params.itemId;
    try {
        let cart = await Cart.findOne({ userId });
        let itemIndex = cart.items.findIndex(p => p.productId == productId);
        if (itemIndex > -1) {
            // If the item is there, and we want it deleted, use the splice method to get rid. 
            let productItem = cart.items[itemIndex];
            cart.bill -= productItem.quantity * productItem.price;
            cart.items.splice(itemIndex, 1);
        }
        // savethis change to the cart, and send it .
        cart = await cart.save();
        return res.status(201).send(cart);
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Sorry, something went wrong...");
    }
}