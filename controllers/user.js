const { response } = require('express')
const User = require('../models/User') // User is capitalized to create an instance
const bcrypt = require('bcrypt')

const getUserById =  async( req, res = response ) => {
    
    // pagination is to asign specifics attributes to show in our response
    const { id } = req.params;

    try {
        // We use Promise casue is more efficient and fast
        const user = await User.findById( id )

        res.status(200).json({
            ok: true,
            user
        })
    
    } catch ( error ) {
        console.log( error );

        res.status(500).json({
            ok: false,
            message: error.message
        });
    }
}

const updateUser =  async( req, res = response ) => {

    const { id } = req.params
    const { password, email, ...rest } = req.body
    try {
        // Validate against the database
        if ( password ) {
            // Encrypt the  password
            const salt = bcrypt.genSaltSync()
            rest.password = bcrypt.hashSync( password, salt )
        }

        const user = await User.findByIdAndUpdate( id, rest )
    
        res.status(200).json({
            ok: true,
            user 
        })

    } catch ( error ) {
        console.log( error );

        res.status(500).json({
            ok: false,
            message: error.message
        });
    }
}


const deleteUser =  async( req, res = response ) => {

    const { id } = req.params

    try {
        // we really erased it
        const user = await User.findByIdAndDelete( id );
    
        res.status(200).json({
            ok: true,
            user 
        })

    } catch ( error ) {
        console.log( error );

        res.status(500).json({
            ok: false,
            message: error.message
        });
    }
}


module.exports = { 
    getUserById,
    updateUser,
    deleteUser,
}