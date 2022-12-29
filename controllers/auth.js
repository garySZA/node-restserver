const { response, json } = require("express");
const bcryp = require("bcryptjs");


const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generar-jwt.js");
const { googleVerify } = require("../helpers/google-verify");

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

const googleSignIn = async ( req, res = response ) => {
    const { id_token } = req.body;

    try{
        const { nombre, img, correo } = await googleVerify( id_token );
        
        let usuario = await Usuario.findOne({ correo });
        
        if( !usuario ){
            //Crear un usuario
            const data = {
                nombre,
                correo,
                password: ':p',
                img,
                rol: 'USER_ROLE',
                google: true
            }
            
            usuario = new Usuario( data );
            await usuario.save();
            
        }

        //Si el usuario en DB
        if( !usuario.estado ){
            return res.status(401).json({
                error: "Hable con el administrador, usuario bloqueado"
            });

        }


        //Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })

    } catch(e){
        res.status(400).json({
            msg: 'Token de Google no es valido'
        });
    }
    
}

module.exports = {
    login,
    googleSignIn
}