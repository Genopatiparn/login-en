// สคริปต์แก้ไข Custom ID ของ Person แบบ batch (แบบ junior dev)
// รันด้วย: node update-person-ids.js

require('dotenv').config();
const mongoose = require('mongoose');
const Person = require('./models/Person');

async function updatePersonIds() {
  try {
    // เชื่อมต่อ database
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('ไม่พบ MONGODB_URI ใน .env file');
    }
    
    await mongoose.connect(mongoURI);
    console.log('✅ เชื่อมต่อ Database สำเร็จ\n');

    // ตัวอย่างการแก้ไข Custom ID
    const updates = [
      { currentId: '88', newId: 'STU2024001' },
      // เพิ่มรายการอื่นๆ ตามต้องการ
      // { currentId: 'OLD_ID', newId: 'NEW_ID' },
    ];

    for (let update of updates) {
      console.log(`🔄 กำลังแก้ไข ID จาก "${update.currentId}" เป็น "${update.newId}"`);
      
      // ค้นหาและแก้ไข
      let person;
      if (update.currentId.match(/^[0-9a-fA-F]{24}$/)) {
        // ถ้าเป็น MongoDB _id
        person = await Person.findByIdAndUpdate(
          update.currentId, 
          { id: update.newId }, 
          { new: true }
        );
      } else {
        // ถ้าเป็น Custom ID
        person = await Person.findOneAndUpdate(
          { id: update.currentId }, 
          { id: update.newId }, 
          { new: true }
        );
      }
      
      if (person) {
        console.log(`✅ แก้ไขสำเร็จ: ${person.firstName} ${person.lastName} (ID: ${update.newId})`);
      } else {
        console.log(`❌ ไม่พบข้อมูลที่มี ID: ${update.currentId}`);
      }
    }

    console.log('\n🎉 แก้ไข Custom ID เรียบร้อยแล้ว!');
    
    // แสดงข้อมูลทั้งหมด
    console.log('\n📋 ข้อมูล Person ทั้งหมด:');
    const allPersons = await Person.find({}, 'id firstName lastName email');
    allPersons.forEach(person => {
      console.log(`- ID: ${person.id || 'ไม่มี'}, ชื่อ: ${person.firstName} ${person.lastName}, อีเมล: ${person.email}`);
    });
    
    // ปิดการเชื่อมต่อ
    await mongoose.connection.close();
    console.log('\n✅ ปิดการเชื่อมต่อ Database แล้ว');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error);
    process.exit(1);
  }
}

updatePersonIds();