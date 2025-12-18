// ทดสอบ API พร้อม Custom ID (แบบ junior dev)
// รันด้วย: node test-api-with-id.js

const baseUrl = 'http://localhost:3000';

console.log('=== ทดสอบ API พร้อม Custom ID ===\n');

console.log('1. สร้าง User พร้อม Custom ID:');
console.log(`curl -X POST ${baseUrl}/api/users/register \\`);
console.log('  -H "Content-Type: application/json" \\');
console.log('  -d \'{"id":"EMP001","username":"john","password":"123","email":"john@test.com","firstName":"John","lastName":"Doe"}\'');

console.log('\n2. สร้าง Person พร้อม Custom ID:');
console.log(`curl -X POST ${baseUrl}/api/persons \\`);
console.log('  -H "Content-Type: application/json" \\');
console.log('  -d \'{"id":"STU001","firstName":"Jane","lastName":"Smith","email":"jane@test.com"}\'');

console.log('\n3. ดึงข้อมูลด้วย Custom ID:');
console.log(`curl -X GET ${baseUrl}/api/persons/STU001`);
console.log(`curl -X GET ${baseUrl}/api/persons/88`);

console.log('\n4. แก้ไขข้อมูลด้วย Custom ID:');
console.log(`curl -X PUT ${baseUrl}/api/persons/STU001 \\`);
console.log('  -H "Content-Type: application/json" \\');
console.log('  -d \'{"firstName":"Updated Jane"}\'');

console.log('\n5. ลบข้อมูลด้วย Custom ID:');
console.log(`curl -X DELETE ${baseUrl}/api/persons/STU001`);

console.log('\n=== ตัวอย่าง Custom ID ===');
console.log('- รหัสพนักงาน: EMP001, EMP002, EMP003');
console.log('- รหัสนักเรียน: STU2024001, STU2024002');
console.log('- รหัสสินค้า: PROD001, PROD002');
console.log('- ตัวเลขง่ายๆ: 88, 99, 100, 101');

console.log('\n=== หมายเหตุ ===');
console.log('- ถ้าไม่ใส่ id จะใช้ _id ของ MongoDB');
console.log('- ถ้าใส่ id จะมีทั้ง _id และ id ใน database');
console.log('- สามารถค้นหาด้วย id หรือ _id ได้');