const mongoose = require('mongoose');

const loggedInUserSchema = new mongoose.Schema({
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
  timestamps: true
});

// เพิ่ม middleware เพื่อ debug
loggedInUserSchema.pre('save', function(next) {
  console.log('กำลัง save LoggedInUser:', this.username);
  next();
});

loggedInUserSchema.post('save', function(doc) {
  console.log('บันทึก LoggedInUser สำเร็จ:', doc);
});

module.exports = mongoose.model('LoggedInUser', loggedInUserSchema);