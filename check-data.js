// สคริปต์ตรวจสอบข้อมูลใน database (แบบ junior dev)
// รันด้วย: node check-data.js

require('dotenv').config();
const mongoose = require('mongoose');
const Person = require('./models/Person');
const User = require('./models/User');
const LoggedInUser = require('./models/LoggedInUser');

async function checkData() {
  try {
    // เชื่อมต่อ database
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('ไม่พบ MONGODB_URI ใน .env file');
    }
    
    await mongoose.connect(mongoURI);
    console.log('✅ เชื่อมต่อ Database สำเร็จ\n');

    // ตรวจสอบ Person
    console.log('📊 ตรวจสอบ Person:');
    const totalPersons = await Person.countDocuments();
    const personsWithId = await Person.countDocuments({ id: { $exists: true } });
    console.log(`  - ทั้งหมด: ${totalPersons} รายการ`);
    console.log(`  - มี id field: ${personsWithId} รายการ`);
    console.log(`  - ไม่มี id field: ${totalPersons - personsWithId} รายการ\n`);

    // ตรวจสอบ User
    console.log('📊 ตรวจสอบ User:');
    const totalUsers = await User.countDocuments();
    const usersWithId = await User.countDocuments({ id: { $exists: true } });
    console.log(`  - ทั้งหมด: ${totalUsers} รายการ`);
    console.log(`  - มี id field: ${usersWithId} รายการ`);
    console.log(`  - ไม่มี id field: ${totalUsers - usersWithId} รายการ\n`);

    // ตรวจสอบ LoggedInUser
    console.log('📊 ตรวจสอบ LoggedInUser:');
    const totalLoggedIn = await LoggedInUser.countDocuments();
    const loggedInWithId = await LoggedInUser.countDocuments({ id: { $exists: true } });
    console.log(`  - ทั้งหมด: ${totalLoggedIn} รายการ`);
    console.log(`  - มี id field: ${loggedInWithId} รายการ`);
    console.log(`  - ไม่มี id field: ${totalLoggedIn - loggedInWithId} รายการ\n`);

    // แสดงตัวอย่างข้อมูล
    console.log('📋 ตัวอย่างข้อมูล Person:');
    const samplePerson = await Person.findOne();
    if (samplePerson) {
      console.log('  _id:', samplePerson._id);
      console.log('  id:', samplePerson.id);
      console.log('  firstName:', samplePerson.firstName);
      console.log('  lastName:', samplePerson.lastName);
    } else {
      console.log('  ไม่มีข้อมูล Person');
    }

    // ปิดการเชื่อมต่อ
    await mongoose.connection.close();
    console.log('\n✅ ปิดการเชื่อมต่อ Database แล้ว');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error);
    process.exit(1);
  }
}

checkData();