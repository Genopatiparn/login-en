const mongoose = require('mongoose');
async function connectDB() {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('ไม่พบ MONGODB_URI ใน .env file');
    }
    
    // ตั้งค่า timezone เป็น Asia/Bangkok (+07:00)
    process.env.TZ = 'Asia/Bangkok';
    
    await mongoose.connect(mongoURI);

    console.log(' เชื่อมต่อ Database สำเร็จ ');
    console.log(` Database: ${mongoose.connection.name}`);
    console.log(` Timezone: ${process.env.TZ}`);
    console.log(` Connection State: ${mongoose.connection.readyState}`); // 1 = connected

  } catch (error) {
    console.error('เชื่อมต่อ Database ไม่สำเร็จ :', error.message);
    process.exit(1);
  }
}

module.exports = { connectDB };