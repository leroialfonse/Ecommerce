// Bring ing mongoose and Schema for mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    // The items will need more information, as another object unto itself, stored as an array of objects in the item.
    items: [{
        productId: {
            type: String,
        },
        name: String,
        quantity: {
            type: Number,
            required: true,
            min: [1, 'Quantity cannot be less that 1.'],
            default: 1
        },
        price: Number
    }],
    total: {
        type: Number,
        required: true,
        default: 0
    }
});

// Don't forget to export the module.

module.exports = Cart = mongoose.model('cart', CartSchema);