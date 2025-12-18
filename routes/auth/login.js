const User = require('../../models/User');
const LoggedInUser = require('../../models/LoggedInUser');

async function login(req, res) {
  try {
    // ตรวจสอบ database connection
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ error: 'Database ไม่ได้เชื่อมต่อ' });
    }
    
    const { username, email, password } = req.body;
    const usernameOrEmail = username || email;
    
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!usernameOrEmail) {
      return res.status(400).json({ error: 'กรุณาระบุชื่อผู้ใช้งานหรืออีเมล' });
    }
    
    if (!password) {
      return res.status(400).json({ error: 'กรุณาระบุรหัสผ่าน' });
    }
    
    // ค้นหาuser
    const user = await User.findOne({
      $or: [
        { username: usernameOrEmail },
        { email: usernameOrEmail }
      ]
    });
    
    if (!user) {
      return res.status(400).json({ error: 'ไม่พบชื่อผู้ใช้งานหรืออีเมลนี้' });
    }
    
    // ตรวจสอบรหัสผ่าน
    if (user.password !== password) {
      return res.status(400).json({ error: 'รหัสผ่านไม่ถูกต้อง' });
    }
    
    // ตรวจสอบว่าloginอยู่แล้วหรือไม่
    const existingLogin = await LoggedInUser.findOne({ username: user.username });
    if (existingLogin) {
      return res.status(400).json({ error: 'บัญชีนี้มีการเข้าสู่ระบบอยู่แล้ว' });
    }
    
    // บันทึกสถานะการlogin
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