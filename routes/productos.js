const { Router } = require("express");
const { check } = require("express-validator");
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, eliminarProducto } = require("../controllers/productos");
const { isValidCategory, existeProductoPorId, existeCategoriaPorId } = require("../helpers/db-validators");
const { validarJWT, validarCampos, esAdminRol } = require("../middlewares");

const router = Router();

//? Obtener productos
router.get("/", obtenerProductos);

//? Obtener porducto por id
router.get("/:id", [
    check('id', 'El id de producto debe ser un idMongo valido.').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
],obtenerProducto);

//? Crear un producto
router.post("/", [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('categoria', 'se debe ingresar un id mongo de categoria valido.').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    check('categoria').custom(isValidCategory),
    check('descripcion', 'se debe ingresar una descripción').notEmpty(),
    validarCampos
],crearProducto);

//? Actualizar un producto
router.put("/:id", [
    validarJWT,
    check('id', 'El id de producto debe ser un idMongo valido.').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], actualizarProducto);

//? Eliminar un producto
router.delete("/:id", [
    validarJWT,
    esAdminRol,
    check('id', 'El id de producto debe ser un idMongo valido.').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
],eliminarProducto);

module.exports = router;