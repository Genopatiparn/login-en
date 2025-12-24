const User = require('../../models/User');
const bcrypt = require('bcrypt');

async function forgotPassword(req, res) {
  try {
    // 1. รับค่าจาก body ที่ส่งมา (ต้องใช้ข้อมูลยืนยันตัวตนหลายอย่างหน่อย เพื่อความปลอดภัย)
    const { username, email, phone, newPassword } = req.body;

    // 2. เช็คว่ากรอกข้อมูลครบไหม
    if (!username) {
      return res.status(400).json({ error: 'กรุณาระบุชื่อผู้ใช้งาน' });
    }
    if (!email) {
      return res.status(400).json({ error: 'กรุณาระบุอีเมลเพื่อยืนยันตัวตน' });
    }
    if (!phone) {
      return res.status(400).json({ error: 'กรุณาระบุเบอร์โทรศัพท์เพื่อยืนยันตัวตน' });
    }
    if (!newPassword) {
      return res.status(400).json({ error: 'กรุณาระบุรหัสผ่านใหม่ที่ต้องการตั้ง' });
    }

    // 3. ค้นหา User จาก username ก่อน
    const user = await User.findOne({ username: username });

    // 4. ถ้าไม่เจอ User ให้แจ้งเตือน
    if (!user) {
      return res.status(404).json({ error: 'ไม่พบชื่อผู้ใช้งานนี้ในระบบ' });
    }

    // 5. ตรวจสอบว่า Email และ Phone ตรงกับที่มีใน Database ไหม (Logic แบบบ้านๆ แทนการส่ง OTP)
    if (user.email !== email || user.phone !== phone) {
      return res.status(401).json({ error: 'ข้อมูลยืนยันตัวตน (อีเมลหรือเบอร์โทรศัพท์) ไม่ถูกต้อง' });
    }

    // 6. ถ้าข้อมูลถูกต้อง เข้ารหัสรหัสผ่านใหม่ก่อนบันทึก
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    
    // 7. อัปเดตเป็นรหัสผ่านใหม่ที่เข้ารหัสแล้ว
    await User.findOneAndUpdate(
      { username: username },
      { password: hashedNewPassword },
      { new: true } // option นี้เพื่อให้ return ค่าใหม่กลับมา (แต่ในที่นี้เราไม่ได้ใช้ตัวแปรรับค่า)
    );

    // 8. ส่ง response กลับไป
    res.json({
      message: 'รีเซ็ตรหัสผ่านเรียบร้อยแล้ว คุณสามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้ทันที',
      username: username
    });

  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการลืมรหัสผ่าน:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน' });
  }
}

module.exports = forgotPassword;