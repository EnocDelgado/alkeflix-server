const { Router } = require('express')
const { check } = require('express-validator')
const { login, createUser, googleSignIn, revalidateToken } = require('../controllers/auth')
const { validateFields } = require('../middlewares/validate-fields')
const { validateJWT } = require('../middlewares/validate-jwt')
const { isValidEmail } = require('../helpers/db-validators');

const router = Router()

router.post('/register', [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Email is invalid").isEmail(),
    check("email").custom( isValidEmail ),
    check("password", "Password must be at least 6 characters long").isLength({ min: 6 }),
    validateFields
], createUser );

router.post('/login', [
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").not().isEmpty(),
    validateFields
], login)

router.post('/google', [
    check("id_token", "id_token is required").not().isEmpty(),
    validateFields
], googleSignIn )


// re-validate token
router.get('/renew', validateJWT, revalidateToken );

module.exports = router