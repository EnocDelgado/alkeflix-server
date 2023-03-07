const mongoose = require('mongoose');

const dbConnection = async() => {

    try {

        await mongoose.connect( process.env.MONG0DB );
        console.log('Connected to database');

    } catch ( error ) {

        console.log( error);
        throw new Error( "Error Establishing a Database Connection" );
    }
}


module.exports = dbConnection;