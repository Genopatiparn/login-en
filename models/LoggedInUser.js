const mongoose = require('mongoose');

const loggedInUserSchema = new mongoose.Schema({
  // รหัสผู้ใช้งาน (แยกจาก _id)
  id: { type: String, unique: true, sparse: true },
  
  username: {
    type: String,
    required: true,
    unique: true
  },
  loginTime: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      // เพิ่ม id กลับเข้าไป (แบบ junior dev)
      ret.id = ret._id;
      
      // แปลง loginTime, createdAt และ updatedAt เป็น timezone +07:00 (Thailand)
      if (ret.loginTime) {
        const loginTimeThailand = new Date(ret.loginTime.getTime() + (7 * 60 * 60 * 1000));
        ret.loginTime = loginTimeThailand.toISOString().replace('Z', '+07:00');
      }
      if (ret.createdAt) {
        const createdAtThailand = new Date(ret.createdAt.getTime() + (7 * 60 * 60 * 1000));
        ret.createdAt = createdAtThailand.toISOString().replace('Z', '+07:00');
      }
      if (ret.updatedAt) {
        const updatedAtThailand = new Date(ret.updatedAt.getTime() + (7 * 60 * 60 * 1000));
        ret.updatedAt = updatedAtThailand.toISOString().replace('Z', '+07:00');
      }
      return ret;
    }
  }
});

// Middleware สำหรับ LoggedInUser
loggedInUserSchema.pre('save', function(next) {
  next();
});

loggedInUserSchema.post('save', function(doc) {
  // บันทึกสำเร็จ
});

module.exports = mongoose.model('LoggedInUser', loggedInUserSchema);