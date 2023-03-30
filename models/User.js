// bring in mongoose 
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { isEmail } = require('validator');

const UserSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, 'Please enter your email to login.'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please use a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please enter a valid password.'],
        minlength: [8, 'Minimum password length must be at least 8 characters.']
    },
    register_date: {
        type: Date,
        default: Date.now
    }
})

//Exporting the model to be used. sets 'users' as the collection in Mongo.
module.exports = User = mongoose.model('user', UserSchema);