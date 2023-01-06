const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );

const { response } = require("express");
const { subirArch } = require("../helpers");

const { Usuario, Producto } = require('../models');

const cargarArchivos = async ( req, res = response ) => {
    try {
        const nombre = await subirArch(req.files, undefined, 'imgs');
    
        res.json({
            nombre
        })
        
    } catch (error) {
        res.status(400).json({
            msg: error
        })
    }


}

const actualizarImagen = async ( req, res = response ) => {
    const { id, coleccion } = req.params;
    
    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id);

            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe un usuario con el id: ${id}`
                })
            }
        break;

        case 'productos':
            modelo = await Producto.findById(id);

            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe un producto con el id: ${id}`
                });
            }
        break;
    
        default:
            return res.status(500).json({
                msg: "Se me olvido validar esto"
            });
    }

    //? Limpiando imagenes previas.
    if ( modelo.img ){
        //? Borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);

            if( fs.existsSync( pathImagen ) ){
                fs.unlinkSync( pathImagen );
            }
    }

    const nombre = await subirArch( req.files, undefined, coleccion );
    modelo.img = nombre;

    await modelo.save();

    res.json({
        modelo
    })
}

const actualizarImagenCloudinary = async ( req, res = response ) => {
    const { id, coleccion } = req.params;
    
    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id);

            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe un usuario con el id: ${id}`
                })
            }
        break;

        case 'productos':
            modelo = await Producto.findById(id);

            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe un producto con el id: ${id}`
                });
            }
        break;
    
        default:
            return res.status(500).json({
                msg: "Se me olvido validar esto"
            });
    }

    //? Limpiando imagenes previas.
    if ( modelo.img ){
        //? Borrar la imagen del servidor
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[ nombreArr.length - 1 ];
        
        const [ public_id ] = nombre.split('.');

        cloudinary.uploader.destroy( public_id );
    }

    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath )

    modelo.img = secure_url;

    await modelo.save();

    res.json({
        modelo
    })
}

//? Mostrar imagenes
const mostrarImagenes = async ( req, res = response ) => {
    const { id, coleccion } = req.params;
    
    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id);

            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe un usuario con el id: ${id}`
                })
            }
        break;

        case 'productos':
            modelo = await Producto.findById(id);

            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe un producto con el id: ${id}`
                });
            }
        break;
    
        default:
            return res.status(500).json({
                msg: "Se me olvido validar esto"
            });
    }

    //? Limpiando imagenes previas.
    if ( modelo.img ){
        //? Borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);

            if( fs.existsSync( pathImagen ) ){
                return res.sendFile( pathImagen )
            }
    }

    const imageNotFound = path.join(__dirname, '../assets/no-image.jpg');

    res.sendFile( imageNotFound );
}

module.exports = {
    cargarArchivos,
    actualizarImagen,
    mostrarImagenes,
    actualizarImagenCloudinary
}