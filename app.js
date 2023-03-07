const express = require('express');
require('dotenv').config();
const cors = require('cors');
const dbConnection = require('./db/config');

const PORT = process.env.PORT || 8989;

// Create Node Server
const app = express();

// Database
dbConnection();

// Cors
app.use( cors() );

// Public directory
app.use( express.static('public') );

// Read and parse configuration from body
app.use( express.json() );

// Routes
app.use('/api/auth', require('./routes/auth') );
// TODO: CRUD: 
app.use('/api/users', require('./routes/user') );


// Connection to react-application
// app.get('*', ( req, res ) => {
//     res.sendFile( __dirname + './public/index.html' );
// })


// Listen port
app.listen( PORT, () => {
    console.log( `Server listening on port ${ PORT }` );
})