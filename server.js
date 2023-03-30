// Libraries that will be imported

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const config = require('config');

// setting express to use app.routes

const app = express();

// bodyparsing.
app.use(express.json());

//Set up server to serve static content generated by React in prod.
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });

}

// Set a connection to MongoDB, mogoose, and a port to listen on.
const dbURI = config.get('dbURI');
const port = process.env.PORT || 8800;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then((result) => app.listen(port))
    .catch((err) => console.log(err));
