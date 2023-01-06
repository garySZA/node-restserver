const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarArchivosubir } = require('../middlewares');
const { cargarArchivos, mostrarImagenes, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');

const router = Router();

router.post('/', validarArchivosubir, cargarArchivos);

router.put('/:coleccion/:id', [
    validarArchivosubir,
    check('id', 'El id debe ser un id valido de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] ) ),
    validarCampos

], actualizarImagenCloudinary)

router.get('/:coleccion/:id', [
    check('id', 'El id debe ser un id valido de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] ) ),
    validarCampos
], mostrarImagenes)

module.exports = router;