const { response } = require("express");
const bcryp = require("bcryptjs");


const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generar-jwt.js");

const login = async ( req, res = response ) => {
    const { correo, password } = req.body;

    try {
        //TODO: Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if( !usuario ){
            return res.status(400).json({
                error: "Usuario/Password no son correctos"
            });

        }

        //TODO Si el usuario esta activo
        if( !usuario.estado ){
            return res.status(400).json({
                error: "Usuario/Password no son correctos - estado: false"
            });

        }

        //TODO Verificar la contrasenia
        const validPassword = await bcryp.compareSync( password, usuario.password );
        if( !validPassword ){
            return res.status(400).json({
                error: "Usuario/Password no son correctos - password"
            });
        }

        //TODO Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })
    }catch(e){
        console.log(e);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}

module.exports = {
    login,
}