const User = require('../../models/User');
const LoggedInUser = require('../../models/LoggedInUser');

async function deleteUser(req, res) {
  try {
    const id = req.params.id;
    
    if (!id) {
      return res.status(400).json({ error: 'กรุณาระบุ ID' });
    }

    // หาผู้ใช้งานก่อน
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'ไม่พบผู้ใช้งานที่ต้องการลบ' });
    }

    // ลบสถานะ login ถ้ามี
    await LoggedInUser.deleteOne({ username: user.username });
    
    // ลบผู้ใช้งาน
    await User.findByIdAndDelete(id);
    
    res.json({ 
      message: 'ลบผู้ใช้งานเรียบร้อยแล้ว',
      deletedUser: user.username
    });
    
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการลบผู้ใช้งาน:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบผู้ใช้งาน' });
  }
}

module.exports = deleteUser;