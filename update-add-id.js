// สคริปต์เพิ่ม id field ให้กับข้อมูลเก่าทั้งหมด (แบบ junior dev)
// รันด้วย: node update-add-id.js

require('dotenv').config();
const mongoose = require('mongoose');
const Person = require('./models/Person');
const User = require('./models/User');
const LoggedInUser = require('./models/LoggedInUser');

async function updateAllData() {
  try {
    // เชื่อมต่อ database
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('ไม่พบ MONGODB_URI ใน .env file');
    }
    
    await mongoose.connect(mongoURI);
    console.log('✅ เชื่อมต่อ Database สำเร็จ\n');

    // อัพเดท Person
    console.log('🔄 กำลังอัพเดท Person...');
    const persons = await Person.find({ id: { $exists: false } });
    console.log(`พบ Person ที่ไม่มี id: ${persons.length} รายการ`);
    
    for (let person of persons) {
      person.id = person._id.toString();
      await person.save();
    }
    console.log(`✅ อัพเดท Person เรียบร้อย: ${persons.length} รายการ\n`);

    // อัพเดท User
    console.log('🔄 กำลังอัพเดท User...');
    const users = await User.find({ id: { $exists: false } });
    console.log(`พบ User ที่ไม่มี id: ${users.length} รายการ`);
    
    for (let user of users) {
      user.id = user._id.toString();
      await user.save();
    }
    console.log(`✅ อัพเดท User เรียบร้อย: ${users.length} รายการ\n`);

    // อัพเดท LoggedInUser
    console.log('🔄 กำลังอัพเดท LoggedInUser...');
    const loggedInUsers = await LoggedInUser.find({ id: { $exists: false } });
    console.log(`พบ LoggedInUser ที่ไม่มี id: ${loggedInUsers.length} รายการ`);
    
    for (let loggedInUser of loggedInUsers) {
      loggedInUser.id = loggedInUser._id.toString();
      await loggedInUser.save();
    }
    console.log(`✅ อัพเดท LoggedInUser เรียบร้อย: ${loggedInUsers.length} รายการ\n`);

    console.log('🎉 อัพเดทข้อมูลทั้งหมดเรียบร้อยแล้ว!');
    
    // ปิดการเชื่อมต่อ
    await mongoose.connection.close();
    console.log('✅ ปิดการเชื่อมต่อ Database แล้ว');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error);
    process.exit(1);
  }
}

updateAllData();
