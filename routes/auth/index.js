var express = require('express');
var router = express.Router();
const login = require('./login');
const register = require('./register');
const logout = require('./logout');
const changePassword = require('./changePassword');
const { forgotPassword, verifySecurityAnswers, resetPassword, testSecurityQuestions } = require('./forgotPassword');
const { getAllUsers, getUsersByRole } = require('./getUsers');
const deleteUser = require('./deleteUser');

router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.post('/changepassword', changePassword);

// 🔑 Security Questions Reset (แทนการส่งอีเมล)
router.post('/forgotpassword', forgotPassword);              // สร้างคำถามความปลอดภัย
router.post('/verify-security-answers', verifySecurityAnswers); // ตรวจสอบคำตอบ
router.post('/resetpassword', resetPassword);                // รีเซ็ตด้วย Token
router.post('/test-security-questions', testSecurityQuestions); // ทดสอบคำถาม (Dev)

router.get('/', getAllUsers);           
router.get('/:role', getUsersByRole);
router.delete('/:id', deleteUser);   

module.exports = router;
