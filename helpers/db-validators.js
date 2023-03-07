
const User  = require('../models/User')


// Verify if the email is valid
const isValidEmail = async( email = "" ) => {
    const emailExists = await User.findOne({ email })
    if ( emailExists ) {
        throw new Error(`Email: ${ email } already exists`)
    }
}


// Verify if the email is valid
const isValidID = async( id ) => {
    const existsID = await User.findById( id )
    if ( !existsID ) {
        throw new Error(`ID: ${ id } does not exist`)
    }
}


module.exports = {
    isValidEmail,
    isValidID,
}