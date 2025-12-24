const User = require('../../models/User');
const LoggedInUser = require('../../models/LoggedInUser');
async function logout(req, res) {
  try {
    const { username, email } = req.body;
    const usernameOrEmail = username || email;
    if (!usernameOrEmail) {
      return res.status(400).json({ error: 'กรุณาระบุชื่อผู้ใช้งานหรืออีเมล' });
    }
    const user = await User.findOne({
      $or: [
        { username: usernameOrEmail },
        { email: usernameOrEmail }
      ]
    });    
    if (!user) {
      return res.status(400).json({ error: 'ไม่พบข้อมูลผู้ใช้งานในระบบ' });
    }
    const loggedInUser = await LoggedInUser.findOne({ username: user.username });
    if (!loggedInUser) {
      return res.status(400).json({ error: 'ผู้ใช้งานนี้ยังไม่ได้เข้าสู่ระบบ' });
    }
    await LoggedInUser.deleteOne({ username: user.username });   
    res.json({
      message: 'ออกจากระบบเรียบร้อยแล้ว',
      username: user.username
    });    
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการออกจากระบบ:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการออกจากระบบ' });
  }
}

module.exports = logout;