// Controlls the logic for registration, making sure a user is logged in/fetching the user to see if authenticated.

// Bring in some required data, like the User model..
const User = require('../models/User');


//And here, the JSON Web Tokes for the of authentication...
const jwt = require('jsonwebtoken');

//...config for bringing in the config package to access JSON stored in teh config folder. This will let me store the JWT secret code.
const config = require('config');

// ...and bcrypt, to hash passwords.
const bcrypt = require('bcrypt');

// Export a signup method. 
module.exports.signup = (req, res) => {
    const { name, email, password } = req.body;

    // If a user fails to enter a field, ask them to enter it
    if (!name || !email || !password) {
        res.status(400).json({ msg: 'Please be sure to enter all fields' });
    }

    // Search the database for the user that has been input.
    User.findOne({ email })
        .then(user => {
            // If the input user already exists, err and notify that the user needs to try again.
            if (user) return res.status(400).json({ msg: 'That user already exists. Please try again, or login with that email if it belongs to you.' });

            // A function to build a new User to store to the database.This will use my Schema. ** Doesn't get saved to the DB just yet, because the password needs to be salted and hashed. 
            const newUser = new User({ name, email, password });

            // Heres the security bit. bcrypt will  salt and hash the password for me. Using 10 rounds (the default) for now. Look back into this later....
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    // Now that the pwd has been protected, the user can be saved to the DB.
                    newUser.save()
                        .then(user => {
                            // Now, a jwt is created to be saved in localstorage. This will provide the userID, a JWT secret, and an expiry time. The token is then sent as a response with user details, but WITHOUT the pw.
                            jwt.sign(
                                { id: user._id },
                                config.get('jwtsecret'),
                                { expiresIn: 3600 },
                                (err, token) => {
                                    if (err) throw err;
                                    res.json({
                                        token,
                                        user: {
                                            id: user._id,
                                            name: user.name,
                                            email: user.email
                                        }
                                    });
                                }
                            )
                        });
                })
            })
        })
}

// Now the function for the login control. 

module.exports.login = async (req, res) => {
    // Deconstruct the request body, to pull out the email and password. 
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ msg: 'Please be sure to enter all fields.' });
    }
    // ... and the find that user in the database.
    User.findOne({ email })
        .then(user => {
            // If they're not there, alert and propmt.
            if (!user) return res.status(400).json({ msg: 'That user was not found. Please check your spelling and try again.' });

            // Validate password by comparing the entered password to the stored password in DB. This uses bcrypt's compare function which is why it works despite hashing.
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    // If there's a missmatch, error and prompt.
                    if (!isMatch) return res.status(400).json({ msg: 'That password doesn\'t match. Please try again.' });


                    //Create a signed JWT token, and then return the token with the user details, without the password.
                    jwt.sign(
                        { id: user._id },
                        config.get('jwtsecret'),
                        { expiresIn: 3600 },
                        (err, token) => {
                            if (err) throw err;
                            res.json({
                                token,
                                user: {
                                    id: user._id,
                                    name: user.name,
                                    email: user.email
                                }
                            });
                        }
                    )
                })
        })
}

// Finally, a get user function. This will find the user by id, and returns sthe user without the pwd as JSON.

module.exports.getUser = (req, res) => {
    User.findById(req.user.id)
        // Get the user, but not the pwd.
        .select('-password')
        .then(user => res.json(user));
}