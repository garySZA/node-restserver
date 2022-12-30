const { Usuario, Categoria, Producto } = require('../models');
const Role = require('../models/role');

const esRoleValido = async (rol='') => {
    const existeRol = await Role.findOne({ rol});
    if( !existeRol ){
        throw new Error(`El rol ${rol} no esta registrado.`)
    }
}

const emailExiste = async (correo='') => {
    const existeEmail = await Usuario.findOne({ correo });
    if( existeEmail ){
        throw new Error(`El correo ${correo} ya esta registrado.`)
    }
}

const existeUsuarioPorId = async (id='') => {
    const existeUsuario = await Usuario.findById(id);
    if(!existeUsuario ){
        throw new Error(`El usuario ${id} no esta registrado.`)
    }
}

const existeCategoriaPorId = async (id='') => {
    const existeCategoria = await Categoria.findById( id );
    if( !existeCategoria ){
        throw new Error(`El id no existe ${id}`);
    }
}

const isValidCategory = async ( idCategory='' ) => {
    const categoriaDB = await Categoria.findById( idCategory );

    if( !categoriaDB.estado ){
        throw new Error(`La categoria ${idCategory} se encuentra bloqueada.`);
    }

}

const existeProductoPorId = async (id='') => {
    const existeProducto = await Producto.findById( id );
    if( !existeProducto ){
        throw new Error(`El id no existe ${id}`);
    }
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    isValidCategory,
    existeProductoPorId
}