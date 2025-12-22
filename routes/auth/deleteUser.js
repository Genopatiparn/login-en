const User = require('../../models/User');
const LoggedInUser = require('../../models/LoggedInUser');

async function deleteUser(req, res) {
  try {
    const id = req.params.id;
    
    if (!id) {
      return res.status(400).json({ error: 'กรุณาระบุ ID' });
    }

    const user = await User.findOne({ id: id });
    if (user) {
      await LoggedInUser.deleteOne({ username: user.username });
      await User.findOneAndDelete({ id: id });
    } 
    if (!user) {
      return res.status(404).json({ error: 'ไม่พบผู้ใช้งานที่ต้องการลบ' });
    }
    
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