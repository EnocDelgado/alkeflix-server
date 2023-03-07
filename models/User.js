const { Schema, model } = require('mongoose');

const UserSchema = Schema({
    
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    google: {
        type: Boolean,  
        default: false 
    },
    
});

module.exports = model( "User", UserSchema );