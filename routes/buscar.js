const { Router } = require ('express');
const { buscar, buscarPorCategoria } = require('../controllers/buscar');


const router = Router();

router.get('/:coleccion/:termino', buscar);
router.get('/:categoria', buscarPorCategoria);

module.exports = router;
