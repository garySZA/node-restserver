const { Router } = require('express');
const { getUsers, putUser, postUser, deleteUser, patchUser } = require('../controllers/user');

const router = Router();

router.get('/', getUsers);

router.post('/', postUser);

router.put('/:id', putUser);

router.patch('/', patchUser);

router.delete('/', deleteUser);

module.exports = router;