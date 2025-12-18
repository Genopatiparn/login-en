var express = require('express');
var router = express.Router();

const login = require('./login');
const register = require('./register');
const logout = require('./logout');
const changePassword = require('./changePassword');
const forgotPassword = require('./forgotPassword');
const { getAllUsers, getUsersByRole } = require('./getUsers');
const deleteUser = require('./deleteUser');

router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.post('/changepassword', changePassword);
router.post('/forgotpassword', forgotPassword);
router.get('/', getAllUsers);           
router.get('/:role', getUsersByRole);
router.delete('/:id', deleteUser);   

module.exports = router;
