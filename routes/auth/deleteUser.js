const User = require('../../models/User');
const LoggedInUser = require('../../models/LoggedInUser');

async function deleteUser(req, res) {
  try {
    const id = req.params.id;
    
    if (!id) {
      return res.status(400).json({ error: 'กรุณาระบุ ID' });
    }

    // หาผู้ใช้งานด้วย _id หรือ id field (แบบ junior dev)
    let user;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // ถ้าเป็น ObjectId format ให้ค้นหาด้วย _id
      user = await User.findById(id);
      if (user) {
        // ลบสถานะ login ถ้ามี
        await LoggedInUser.deleteOne({ username: user.username });
        // ลบผู้ใช้งาน
        await User.findByIdAndDelete(id);
      }
    } else {
      // ถ้าไม่ใช่ ให้ค้นหาด้วย id field (รหัสพนักงาน)
      user = await User.findOne({ id: id });
      if (user) {
        // ลบสถานะ login ถ้ามี
        await LoggedInUser.deleteOne({ username: user.username });
        // ลบผู้ใช้งาน
        await User.findOneAndDelete({ id: id });
      }
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