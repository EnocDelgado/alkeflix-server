const { response, request } = require("express")
const jwt = require("jsonwebtoken")
const User = require("../models/User")


const validateJWT = async(req = request, res = response, next) => {
    
    const token = req.header('x-token')
    if ( !token ) {
        return res.status(401).json({
            msg: "Invalid token provided"
        })
    }

    try {

        const { uid, name } = jwt.verify(token, process.env.SECRETPRIVATE_KEY)

        // Read the user token
        const user = await User.findById( uid )

        // Verify if user exists
        if ( !user ) {
            return res.status(401).json({
                msg: "Invalid token provided - user does not exist in the database"
            })
        }

        req.uid = user;
        req.name = name;

    } catch (err) {
        console.error(err)
        res.status(401).json({
            msg: "Invalid token provided"
        })
    }

    next()
}

module.exports = {
    validateJWT
}