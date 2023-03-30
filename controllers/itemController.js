const Item = require('../models/Item');
const Itme = require('../models/Item');

// Get all the items from the DB

module.exports.getItems = (req, res) => {
    // Look in the Items collection, sort by most recently added, and then return the list of items as json.
    Item.find().sort({ date: -1 }).then(items => res.json(items));
}

// Add new items into the cart. 

