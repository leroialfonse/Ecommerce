// Middleware to determine if a user is logged in.

//requires for config and JWT
const config = require('config');
const jwt = require('jsonwebtoken');

// the function to verify auth. will use the header 'x-auth-token'
function auth(req, res, next) {
    const token = req.header('x-auth-token');

    // Check for a token, and if not found, error message and notify.
    if (!token) {
        return res.status(401).json({ msg: "No token found, authorization denied." });

    }

    // try, catch for verifying the token.

    try {
        // the actual verify 
        // jwt verify method.
        const decoded = jwt.verify(token, config.get('jwtsecret'));

        // Add a user from the payload.
        req.user = decoded;
        next();
    } catch (e) {
        res.status(400).json({ msg: 'Invalid token.' });
    }
}

module.exports = auth;