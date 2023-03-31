const Item = require('../models/Item');

// Get all the items from the DB

module.exports.getItems = (req, res) => {
    // Look in the Items collection, sort by most recently added, and then return the list of items as json.
    Item.find().sort({ date: -1 }).then(items => res.json(items));
}

// Add new items into the cart. 
module.exports.postItem = (req, res) => {
    const newItem = new Item(req.body);
    newItem.save().then(item => res.json(item));
}

// Update items
module.exports.updateItem = (req, res) => {
    Item.findByIdAndUpdate({ _id: req.params.id }, req.body).then((item) => {
        Item.findOne({ _id: req.parms.id }).then(function (item) {
            res.json(item);
        });
    });
}

// Delete Items
module.exports.deleteItem = (req, res) => {
    Item.findByIdAndDelete({ _id: req.params.id }).then((item) => {
        res.json({ success: true });
    });
}

