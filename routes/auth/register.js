const User = require('../../models/User');
const bcrypt = require('bcrypt');

async function register(req, res) {
  try {
    const { id, username, password, email, firstName, lastName, phone, age, role } = req.body;
    if (!username) {
      return res.status(400).json({ error: 'กรุณาระบุชื่อผู้ใช้งาน' });
    }   
    if (!password) {
      return res.status(400).json({ error: 'กรุณาระบุรหัสผ่าน' });
    }    
    if (!email) {
      return res.status(400).json({ error: 'กรุณาระบุอีเมล' });
    }    
    if (!firstName) {
      return res.status(400).json({ error: 'กรุณาระบุชื่อ' });
    } 
    if (!lastName) {
      return res.status(400).json({ error: 'กรุณาระบุนามสกุล' });
    }
    const existUser = await User.findOne({ username: username });
    if (existUser) {
      return res.status(400).json({ error: 'ชื่อผู้ใช้งานนี้ถูกใช้งานแล้ว' });
    }
    const existEmail = await User.findOne({ email: email });
    if (existEmail) {
      return res.status(400).json({ error: 'อีเมลนี้ถูกใช้งานแล้ว' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      id: id || '', 
      username: username, 
      password: hashedPassword, 
      email: email, 
      firstName: firstName, 
      lastName: lastName,
      phone: phone,
      age: age,
      role: role || 'user'
    }); 

    const savedUser = await newUser.save();    
    res.status(201).json({
      message: 'ลงทะเบียนสมาชิกเรียบร้อยแล้ว',
      user: {
        username: savedUser.username,
        email: savedUser.email,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        role: savedUser.role
      }
    });  
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการลงทะเบียน:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลงทะเบียน' });
  }
}

module.exports = register;