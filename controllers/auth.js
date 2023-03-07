const { response } = require("express")
const bcrypt = require("bcrypt")
const User = require("../models/User")
const { generateJWT } = require("../helpers/generate-jwt")
const { googleVerify } = require("../helpers/google-verify")

const login = async( req, res = response ) => {

    const { email, password } = req.body

    try {
        // Verify if email exists
        const user = await User.findOne({ email })
        if ( !user ) {
            return res.status(400).json({
                ok: false,
                msg: "User / Password not found - email"
            })
        }

        // Verify password
        // CompareSync is a funtion that verify if the password is equal to user password
        const validatePassword = bcrypt.compareSync( password, user.password )
        if ( !validatePassword ) {
            return res.status(400).json({
                ok: false,
                msg: "User / Password not found - password"
            })
        }
        // Generate jwt token
        const token = await generateJWT( user.id, user.name )

        res.status(200).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })

    } catch ( err ) {
        console.error( err )

        res.status(500).json({
            ok: false,
            message: "Talk with admin"
        })
    }
}

const createUser =  async( req, res = response ) => {

    // This is to read the body of the request
    const { name, email, password } = req.body

    try {
        const user = new User({ name, email, password })
    
        // Encrypt the password
        const salt = bcrypt.genSaltSync() // Salt is numbers of shifts for encryption
        user.password = bcrypt.hashSync( password, salt )
    
        // user save is to save in MongoDB
        await user.save();

        // Generate Json Web Token
        const token = await generateJWT( user.id, user.name)

    
        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })

    } catch ( error ) {
        console.log( error );

        res.status(500).json({
            ok: false,
            message: error.message
        });
    }
}

const googleSignIn = async( req, res = response) => {

    const { id_token } = req.body

    try {
        const { email, name, picture } = await googleVerify( id_token )

        // Verify if user not exist
        let user = await User.findOne({ email })

        if ( !user ) {
            // Have to create it
            const data = {
                name,
                email,
                password: "pm9",
                picture,
                role: "USER_ROLE",
                google: true
            }

            user = new User( data )
            await user.save()
        }

        // Verify if user has false status
        if (!user.state ) {
            return res.status(400).json({
                msg: "Talk to the administrator, user with blocked access"
            })
        }

        // Generate jwt token
        const token = await generateJWT( user.id )
        
        res.json({
            user,
            token
        })
    } catch ( err ) {
        res.status( 400 ).json({
            ok: false,
            msg: "Token not verified"
        })
    }

}

const revalidateToken = async(req, res = response ) => {

    const { uid, name } = req;

    // Generate a new token an return it to the request
    const token = await generateJWT( uid, name );

    res.status(201).json({
        ok: true,
        uid, name,
        token
    })
}


module.exports = { 
    login,
    createUser,
    googleSignIn,
    revalidateToken
}