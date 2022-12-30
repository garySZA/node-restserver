const { response } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const validarJWT = async ( req, res=response, next ) => {
    const token = req.header('x-token');

    if( !token ){
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        })
    }

    try{
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        
        //leer el usuario que correspode al uid
        const usuarioAuth = await Usuario.findById( uid );

        if( !usuarioAuth ){
            return res.status(401).json({
                msg: 'Token invalido - Usuario no encontrado'
            })
        }

        if( !usuarioAuth.estado ){


            return res.status(401).json({
                msg: 'Token inválido - usuario con estado false'

            })
        }

        req.usuario = usuarioAuth;

        next();
    } catch(err) {
    
        console.log(err);
        res.status(401).json({
            msg: 'Token inválido'
        })
    
    }
}

module.exports = {
    validarJWT
}