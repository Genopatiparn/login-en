// ทดสอบว่า Custom ID แยกจาก _id แล้ว (แบบ junior dev)
// รันด้วย: node test-separate-id.js

console.log('=== ทดสอบ Custom ID แยกจาก _id ===\n');

console.log('1. สร้างข้อมูลไม่มี Custom ID (id ควรเป็น null):');
console.log('curl -X POST http://localhost:3000/api/persons \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -d \'{"firstName": "Test1", "lastName": "NoID", "email": "test1@test.com"}\'');

console.log('\n2. สร้างข้อมูลมี Custom ID (id ควรเป็น "STU001"):');
console.log('curl -X POST http://localhost:3000/api/persons \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -d \'{"id": "STU001", "firstName": "Test2", "lastName": "WithID", "email": "test2@test.com"}\'');

console.log('\n3. ดูข้อมูลทั้งหมด:');
console.log('curl -X GET http://localhost:3000/api/persons');

console.log('\n4. ค้นหาด้วย Custom ID:');
console.log('curl -X GET http://localhost:3000/api/persons/STU001');

console.log('\n=== ผลลัพธ์ที่คาดหวัง ===');
console.log('ข้อมูลที่ 1: "_id": "6943...", "id": null');
console.log('ข้อมูลที่ 2: "_id": "6944...", "id": "STU001"');
console.log('');
console.log('✅ _id กับ id จะต่างกันแล้ว!');
console.log('✅ _id = MongoDB ObjectId');
console.log('✅ id = Custom ID ที่เราตั้งเอง (หรือ null ถ้าไม่ตั้ง)');