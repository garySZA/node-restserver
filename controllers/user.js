const { response, request } = require('express')

const getUsers = (req = request, res = response) => {
    const params = req.query;
    
    res.json({
        ok: true,
        msg: 'get API - controller'
    });

}

const postUser = (req, res = response) => {
    const body = req.body;
    
    res.json({
        ok: true,
        msg: 'post API - controller',
        body
    });
};

const putUser = (req, res = response) => {
    const idUser = req.params.id;
    
    res.json({
        ok: true,
        msg: 'put API - controller',
        idUser
    });
};

const patchUser = (req, res) => {
    res.json({
        ok: true,
        msg: 'patch API - controller'
    });
};

const deleteUser = (req, res) => {
    res.json({
        ok: true,
        msg: 'delete API - controller'
    });
};

module.exports = {
    getUsers,
    putUser,
    postUser,
    patchUser,
    deleteUser
}