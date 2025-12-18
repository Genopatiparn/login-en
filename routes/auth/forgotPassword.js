const User = require('../../models/User');

async function forgotPassword(req, res) {
  try {
    const { email, newPassword } = req.body;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!email) {
      return res.status(400).json({ error: 'กรุณาระบุอีเมล' });
    }
    
    if (!newPassword) {
      return res.status(400).json({ error: 'กรุณาระบุรหัสผ่านใหม่' });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ error: 'ไม่พบอีเมลนี้ในระบบ' });
    } 
    
    await User.findOneAndUpdate(
      { email: email },
      { password: newPassword },
      { new: true }
    );
    
    res.json({
      message: 'ตั้งค่ารหัสผ่านใหม่เรียบร้อยแล้ว',
      email: email
    });
    
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน' });
  }
}

module.exports = forgotPassword;