const User = require('../../models/User');

async function getAllUsers(req, res) {
  try {
    const users = await User.find({});
    res.json({
      message: 'ดึงข้อมูลผู้ใช้งานทั้งหมดสำเร็จ',
      users: users,
      total: users.length
    });
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้งาน:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้งาน' });
  }
}

async function getUsersByRole(req, res) {
  try {
    const role = req.params.role;
    // วิธี junior dev: ใช้ MongoDB query ตรงๆ
    const users = await User.find({ role: role });

    if (users.length > 0) {
      res.json({
        message: `ดึงข้อมูลผู้ใช้งานกลุ่ม ${role} สำเร็จ`,
        users: users,
        total: users.length
      });
    } else {
      res.status(404).json({ error: 'ไม่พบผู้ใช้งานในบทบาทนี้' });
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้งาน:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้งาน' });
  }
}

module.exports = { getAllUsers, getUsersByRole };