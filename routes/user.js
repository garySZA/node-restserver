const { Router } = require('express');
const { check } = require('express-validator');
const { getUsers, putUser, postUser, deleteUser, patchUser } = require('../controllers/user');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();

router.get('/', getUsers);

router.post('/',[
        check('nombre', 'El nombre es obligatorio').notEmpty(),
        check('correo', 'El correo no es valido').isEmail(),
        check('correo').custom( emailExiste ),
        check('password', 'El password debe de ser mas de 6 letras').isLength({ min: 6 }),
        // check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
        check('rol').custom( esRoleValido ),
        validarCampos

    ], postUser);

router.put('/:id', [
        check('id', 'No es un ID valido').isMongoId(),
        check('id').custom( existeUsuarioPorId ),
        check('rol').custom( esRoleValido ),
        validarCampos
    ], putUser);

router.patch('/', patchUser);

router.delete('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
    ], deleteUser);

module.exports = router;