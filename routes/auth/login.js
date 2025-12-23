const User = require('../../models/User');
const LoggedInUser = require('../../models/LoggedInUser');
const bcrypt = require('bcrypt');
async function login(req, res) {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      console.error('Database connection state:', mongoose.connection.readyState);
      return res.status(500).json({ error: 'ไม่ได้เชื่อมต่อDatabase' });
    }
    const { username, email, password } = req.body;
    const usernameOrEmail = username || email;
    if (!usernameOrEmail) {
      return res.status(400).json({ error: 'กรุณาระบุชื่อผู้ใช้งานหรืออีเมล' });
    }
    if (!password) {
      return res.status(400).json({ error: 'กรุณากรอกรหัสผ่าน' });
    }
    const user = await User.findOne({
      $or: [
        { username: usernameOrEmail },
        { email: usernameOrEmail }
      ]
    });   
    if (!user) {
      return res.status(400).json({ error: 'ไม่พบชื่อผู้ใช้งานหรืออีเมลนี้' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'รหัสผ่านไม่ถูกต้อง' });
    }
    try {
      const existingLogin = await LoggedInUser.findOne({ username: user.username });
      if (existingLogin) {
        existingLogin.loginTime = new Date();
        await existingLogin.save();
        console.log(`อัปเดตสถานะ login สำหรับ user: ${user.username}`);
      } else {
        const loggedInUser = new LoggedInUser({ username: user.username });
        await loggedInUser.save();
        console.log(`สร้างสถานะ login ใหม่สำหรับ user: ${user.username}`);
      }
    } catch (loginStateError) {
      console.error('เกิดข้อผิดพลาดในการจัดการสถานะ login:', loginStateError);
      console.error('Error details:', {
        name: loginStateError.name,
        message: loginStateError.message,
        code: loginStateError.code
      });
      return res.status(500).json({ 
        error: 'ไม่สามารถบันทึกสถานะการเข้าสู่ระบบได้',
        details: loginStateError.message 
      });
    }
    res.json({
      message: 'เข้าสู่ระบบสำเร็จ',
      user: {
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการเข้าสู่ระบบ:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' });
  }
}
module.exports = login;