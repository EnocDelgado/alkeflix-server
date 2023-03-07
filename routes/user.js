const { Router } = require('express');
const { check } = require('express-validator');
const { getUserById, updateUser, deleteUser } = require('../controllers/user');
const { isValidID } = require('../helpers/db-validators');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();


router.get('/:id', [
    check('id', 'It is not a MongoDB id valid').isMongoId(),
    check('id').custom( isValidID ),
    // validateFields,
], getUserById );

router.put('/:id', [
    validateJWT,
    check("id", "Invalid id").isMongoId(),
    check("id").custom( isValidID ),
    validateFields
], updateUser );

router.delete('/:id', [
    validateJWT,
    check("id", "Invalid id").isMongoId(),
    check("id").custom( isValidID ),
    validateFields
], deleteUser );

    
module.exports = router;