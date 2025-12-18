// สคริปต์ลบ id field ที่ผิดออกจาก database (แบบ junior dev)
// รันด้วย: node cleanup-id.js

require('dotenv').config();
const mongoose = require('mongoose');

async function cleanupId() {
  try {
    // เชื่อมต่อ database
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('ไม่พบ MONGODB_URI ใน .env file');
    }
    
    await mongoose.connect(mongoURI);
    console.log('✅ เชื่อมต่อ Database สำเร็จ\n');

    // ลบ id field ออกจาก Person collection
    console.log('🔄 กำลังลบ id field จาก Person...');
    const personResult = await mongoose.connection.db.collection('people').updateMany(
      { id: { $exists: true } },
      { $unset: { id: "" } }
    );
    console.log(`✅ ลบ id field จาก Person: ${personResult.modifiedCount} รายการ\n`);

    // ลบ id field ออกจาก User collection
    console.log('🔄 กำลังลบ id field จาก User...');
    const userResult = await mongoose.connection.db.collection('users').updateMany(
      { id: { $exists: true } },
      { $unset: { id: "" } }
    );
    console.log(`✅ ลบ id field จาก User: ${userResult.modifiedCount} รายการ\n`);

    // ลบ id field ออกจาก LoggedInUser collection
    console.log('🔄 กำลังลบ id field จาก LoggedInUser...');
    const loggedInResult = await mongoose.connection.db.collection('loggedinusers').updateMany(
      { id: { $exists: true } },
      { $unset: { id: "" } }
    );
    console.log(`✅ ลบ id field จาก LoggedInUser: ${loggedInResult.modifiedCount} รายการ\n`);

    console.log('🎉 ลบ id field ทั้งหมดเรียบร้อยแล้ว!');
    console.log('ตอนนี้ id จะถูกสร้างจาก _id อัตโนมัติผ่าน virtual field');
    
    // ปิดการเชื่อมต่อ
    await mongoose.connection.close();
    console.log('✅ ปิดการเชื่อมต่อ Database แล้ว');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error);
    process.exit(1);
  }
}

cleanupId();