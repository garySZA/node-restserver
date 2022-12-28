const { response, request } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');

const getUsers = async (req = request, res = response) => {
    const { limit=100, desde=0 } = req.query;
    const query = { estado: true }

    const [ total, usuarios ] = await Promise.all([
        Usuario.count(query),
        Usuario.find( query )
            .skip(Number( desde ))
            .limit(Number( limit ))
    ]);

    res.json({
        total,
        usuarios
    });

}

const postUser = async (req, res = response) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario( {nombre, correo, password, rol} );

    //Encriptar la contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync( usuario.password, salt );

    //Guardar en DB
    await usuario.save();
    
    res.json({
        usuario
    });
};

const putUser = async (req, res = response) => {
    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    //TODO: validar contra BD
    if( password ){
        const salt  = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync( password, salt );

    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );
    
    res.json(usuario);
};

const patchUser = (req, res) => {
    res.json({
        ok: true,
        msg: 'patch API - controller'
    });
};

const deleteUser = async (req, res=response) => {
    const { id } = req.params;

    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});

    res.json(usuario);
};

module.exports = {
    getUsers,
    putUser,
    postUser,
    patchUser,
    deleteUser
}