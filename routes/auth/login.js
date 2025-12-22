const User = require('../../models/User');
const LoggedInUser = require('../../models/LoggedInUser');
const bcrypt = require('bcrypt');
async function login(req, res) {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
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
    const existingLogin = await LoggedInUser.findOne({ username: user.username });
    if (existingLogin) {
      return res.status(400).json({ error: 'บัญชีนี้มีการเข้าสู่ระบบอยู่แล้ว' });
    }
    const loggedInUser = new LoggedInUser({ username: user.username });
    try {
      await loggedInUser.save();
    } catch (saveError) {
      console.error('เกิดข้อผิดพลาดในการบันทึกสถานะ login:', saveError);
      return res.status(500).json({ error: 'ไม่สามารถบันทึกสถานะการเข้าสู่ระบบได้' });
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