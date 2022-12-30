const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');

const { validarJWT, validarCampos, esAdminRol } = require('../middlewares');

const router = Router();

//{{url}}/api/categorias

//?? Obtener todas las categorias
router.get('/', obtenerCategorias);

//? Obtener una categoria por ID
router.get('/:id', [ 
    check('id', 'El id debe ser un id valido de mongo').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], obtenerCategoria);

//? Crear una categoria - privado - persona con token valido
router.post('/', [ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    validarCampos

], crearCategoria);

//? Actualizar categoria - privato - persona con token valido
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('id', 'El id debe ser un id valido de mongo').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos

],actualizarCategoria);

//? Eliminar categoria - privado - solo admin
router.delete('/:id', [
    validarJWT,
    esAdminRol,
    check('id', 'El id debe ser un id valido de mongo').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], borrarCategoria);

module.exports = router;
