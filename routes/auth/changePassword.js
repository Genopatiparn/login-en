const User = require('../../models/User');
const bcrypt = require('bcrypt');
async function changePassword(req, res) {
  
  try {
    const { username, oldPassword, newPassword } = req.body;
    if (!username) {
      return res.status(400).json({ error: 'กรุณาระบุชื่อผู้ใช้งาน' });
    }    
    if (!oldPassword) {
      return res.status(400).json({ error: 'กรุณาระบุรหัสผ่านเก่า' });
    }
    if (!newPassword) {
      return res.status(400).json({ error: 'กรุณาระบุรหัสผ่านใหม่' });
    }
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(400).json({ error: 'ไม่พบชื่อผู้ใช้งานนี้ในระบบ' });
    } 
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return res.status(400).json({ error: 'รหัสผ่านเก่าไม่ถูกต้อง' });
    } 
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);    

    await User.findOneAndUpdate(
      { username: username },
      { password: hashedNewPassword },
      { new: true }
    );    
    res.json({
      message: 'เปลี่ยนรหัสผ่านเรียบร้อยแล้ว',
      username: username
    });
    
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน' });
  }
}

module.exports = changePassword;