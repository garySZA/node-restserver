const { response } = require("express");
const { Producto, Categoria } = require("../models");

//! Obtencion de todos los productos registrados
const obtenerProductos = async (req, res = response) => {
    const { limite=100, desde=0 } = req.query;
    const query = { estado: true };

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments( query ),
        Producto.find( query )
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip( Number( desde ) )
            .limit( Number( limite ) )
    ]);

    res.json({
        total,
        productos
    });
}

//! Obtencion de un producto por ID
const obtenerProducto = async (req, res = response) => {
    const { id } = req.params;
    const productoDB = await Producto.findById(id)
                                .populate('usuario', 'nombre')
                                .populate('categoria', 'nombre');
    
    if( !productoDB ){
        return res.json({
            msg: `Producto ${ id } no se encuentra en la DB`
        });
    };

    res.status(200).json({
        producto: productoDB
    })
}

//! Creacion de nuevos productos
const crearProducto = async (req, res = response) => {
    const { estado, usuario, ...body } = req.body;

    const productoDB = await Producto.findOne({ nombre: body.nombre });

    //? Verificando si el nombre de producto ya esta registrado
    if( productoDB ){
        return res.status(400).json({
            error: `El producto: ${nombre} ya existe`
        });
    }

    //Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id,
    }

    const producto = new Producto(data);


    //? Guardar en la DB
    await producto.save();

    return res.status(201).json(producto);

}

//! Actualizar un producto
const actualizarProducto = async ( req, res = response ) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if( data.nombre ){
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;
    
    const producto = await Producto.findByIdAndUpdate( id, data, { new: true } );

    res.json( producto );

}

//! Eliminar un producto
const eliminarProducto = async ( req, res = response ) => {
    const { id } = req.params;

    const productoDB = await Producto.findByIdAndUpdate( id, { estado: false }, { new: true } );

    res.json({
        msg: 'Producto eliminado',
        productoDB
    })
}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    eliminarProducto
}