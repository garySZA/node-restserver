const { response } = require('express');
const { isValidObjectId } = require('mongoose');
const { ObjectId } = require('bson');

const { Categoria, Producto } = require('../models');
const Usuario = require('../models/usuario');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios = async ( termino = '',  res = response ) => {
    const esMongoID = isValidObjectId( termino )

    if( esMongoID ){
        const usuario = await Usuario.findById( termino );

        return res.json({
            results: usuario ? [ usuario ] : []
        });
    }

    const regex = new RegExp( termino, 'i' );

    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });

    res.json({
        results: usuarios
    });

}

const buscarCategorias = async ( termino = '',  res = response ) => {
    const esMongoID = isValidObjectId( termino )
    
    if( esMongoID ){
        const categoria = await Categoria.findById( termino );

        return res.json({
            results: categoria ? [ categoria ] : []
        });
    }

    const regex = new RegExp( termino, 'i' );

    const categorias = await Categoria.find({ nombre: regex, estado: true })
    .populate('usuario', 'nombre');

    res.json({
        results: categorias
    });
}

const buscarProductos = async ( termino = '',  res = response ) => {
    const esMongoID = isValidObjectId( termino );

    if( esMongoID ){
        const producto = await Producto.findById( termino ).populate('categoria', 'nombre');

        return res.json({
            results: producto? [ producto ] : []
        });
    }

    const regex = new RegExp( termino, 'i' );

    const productos = await Producto.find({ nombre: regex, estado: true }).populate('categoria', 'nombre');

    res.json({
        results: productos
    });
}

const buscar = ( req,  res = response ) => {
    const { coleccion, termino } = req.params;

    if( !coleccionesPermitidas.includes( coleccion ) ){
        res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        });
    }

    switch (coleccion){
        case 'usuarios':
            buscarUsuarios( termino, res );
        break;
        case 'categorias':
            buscarCategorias( termino, res );
        break;
        case 'productos':
            buscarProductos( termino, res );
        break;
        case 'roles':

        break;

        default:
    res.status(500).json({
        msg: 'Se le olvido hacer esta busqueda'
    })

    }
}

const buscarPorCategoria = async ( req, res = response ) => {
    const { categoria } = req.params;
    
    const esMongoID = isValidObjectId(categoria);

    if( esMongoID ){
        const producto = await Producto.find({ categoria: ObjectId(categoria) })

        return res.json({
            results: producto? [ producto ] : []
        });
    }

    const regex = new RegExp( categoria, 'i' );

    const categorias = await Categoria.find({ categoria: regex, estado: true })

    if( !categorias.length ){
        return res.status(400).json({
            msg: `No se encontraron categorias con ${categoria}`
        })
    }

    const productos = await Producto.find({
        $or: [...categorias.map( c => { return { categoria: c._id } } )],
        $and: [{ status: true }]
    })
        .populate('categoria', 'nombre');


    res.json({
        results: productos
    });
}
module.exports = {
    buscar,
    buscarPorCategoria
}