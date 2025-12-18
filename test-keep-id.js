// ทดสอบว่า Custom ID ยังอยู่หรือไม่ (แบบ junior dev)
// รันด้วย: node test-keep-id.js

console.log('=== ทดสอบเก็บ Custom ID ===\n');

console.log('1. ดูข้อมูลก่อนแก้ไข:');
console.log('curl -X GET http://localhost:3000/api/persons/88');

console.log('\n2. แก้ไขเฉพาะชื่อ (ไม่ส่ง id):');
console.log('curl -X PUT http://localhost:3000/api/persons/88 \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -d \'{"firstName": "ชื่อทดสอบ"}\'');

console.log('\n3. ดูข้อมูลหลังแก้ไข (Custom ID ควรยังเป็น 88):');
console.log('curl -X GET http://localhost:3000/api/persons/88');

console.log('\n4. แก้ไขเบอร์โทร (ไม่ส่ง id):');
console.log('curl -X PUT http://localhost:3000/api/persons/88 \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -d \'{"phone": "0999999999"}\'');

console.log('\n5. ดูข้อมูลอีกครั้ง (Custom ID ควรยังเป็น 88):');
console.log('curl -X GET http://localhost:3000/api/persons/88');

console.log('\n=== ผลลัพธ์ที่คาดหวัง ===');
console.log('- Custom ID ควรยังเป็น "88" ตลอด');
console.log('- เฉพาะข้อมูลที่ส่งไปใหม่เท่านั้นที่เปลี่ยน');
console.log('- ถ้าไม่ส่ง "id" ใน request = Custom ID เดิมจะถูกเก็บไว้');