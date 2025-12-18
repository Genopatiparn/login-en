// ทดสอบการอัพเดทแบบง่ายๆ (แบบ junior dev)
// รันด้วย: node test-simple-update.js

const baseUrl = 'http://localhost:3000';

console.log('=== ทดสอบการอัพเดท Custom ID ===\n');

console.log('1. ดูข้อมูลปัจจุบัน:');
console.log(`curl -X GET ${baseUrl}/api/persons/88`);

console.log('\n2. อัพเดทเฉพาะชื่อ (Custom ID ควรยังอยู่):');
console.log(`curl -X PUT ${baseUrl}/api/persons/88 \\`);
console.log('  -H "Content-Type: application/json" \\');
console.log('  -d \'{"firstName": "ชื่อใหม่"}\'');

console.log('\n3. อัพเดท Custom ID ใหม่:');
console.log(`curl -X PUT ${baseUrl}/api/persons/88 \\`);
console.log('  -H "Content-Type: application/json" \\');
console.log('  -d \'{"id": "STU001"}\'');

console.log('\n4. ดูข้อมูลด้วย Custom ID ใหม่:');
console.log(`curl -X GET ${baseUrl}/api/persons/STU001`);

console.log('\n5. อัพเดทข้อมูลหลายอย่างพร้อมกัน:');
console.log(`curl -X PUT ${baseUrl}/api/persons/STU001 \\`);
console.log('  -H "Content-Type: application/json" \\');
console.log('  -d \'{"firstName": "ชื่อใหม่2", "phone": "0812345678"}\'');

console.log('\n=== หมายเหตุ ===');
console.log('- ถ้าไม่ใส่ "id" ใน request body = Custom ID เดิมจะยังอยู่');
console.log('- ถ้าใส่ "id" ใน request body = จะเปลี่ยน Custom ID ใหม่');
console.log('- ระบบจะตรวจสอบ Custom ID ซ้ำอัตโนมัติ');