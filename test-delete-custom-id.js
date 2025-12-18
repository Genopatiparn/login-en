// ทดสอบการลบข้อมูลด้วย Custom ID (แบบ junior dev)
// รันด้วย: node test-delete-custom-id.js

const baseUrl = 'http://localhost:3000';

console.log('=== ทดสอบการลบข้อมูลด้วย Custom ID ===\n');

console.log('1. สร้างข้อมูลทดสอบ:');
console.log(`curl -X POST ${baseUrl}/api/persons \\`);
console.log('  -H "Content-Type: application/json" \\');
console.log('  -d \'{"id":"TEST001","firstName":"Test","lastName":"Delete","email":"test@delete.com"}\'');

console.log('\n2. ตรวจสอบข้อมูลที่สร้าง:');
console.log(`curl -X GET ${baseUrl}/api/persons/TEST001`);

console.log('\n3. ลบข้อมูลด้วย Custom ID:');
console.log(`curl -X DELETE ${baseUrl}/api/persons/TEST001`);

console.log('\n4. ตรวจสอบว่าลบแล้ว (ควรได้ 404):');
console.log(`curl -X GET ${baseUrl}/api/persons/TEST001`);

console.log('\n=== ทดสอบกับข้อมูลที่มีอยู่ ===');
console.log('5. ลบข้อมูลที่มี Custom ID = "88":');
console.log(`curl -X DELETE ${baseUrl}/api/persons/88`);

console.log('\n6. ลบข้อมูลด้วย MongoDB _id:');
console.log(`curl -X DELETE ${baseUrl}/api/persons/6943bd50f0c72b8a390def40`);

console.log('\n=== ทดสอบ User ===');
console.log('7. สร้าง User ทดสอบ:');
console.log(`curl -X POST ${baseUrl}/api/users/register \\`);
console.log('  -H "Content-Type: application/json" \\');
console.log('  -d \'{"id":"TESTUSER001","username":"testuser","password":"123","email":"test@user.com","firstName":"Test","lastName":"User"}\'');

console.log('\n8. ลบ User ด้วย Custom ID:');
console.log(`curl -X DELETE ${baseUrl}/api/users/TESTUSER001`);

console.log('\n=== หมายเหตุ ===');
console.log('- ตอนนี้สามารถลบด้วย Custom ID หรือ MongoDB _id ได้แล้ว');
console.log('- ระบบจะตรวจสอบรูปแบบของ ID อัตโนมัติ');
console.log('- ถ้าเป็น 24 ตัวอักษร hex = MongoDB _id');
console.log('- ถ้าไม่ใช่ = Custom ID');