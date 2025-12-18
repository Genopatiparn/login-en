// ไฟล์ทดสอบ API endpoints แบบ junior dev
// รันด้วย: node test-api.js

const baseUrl = 'http://localhost:3000';

console.log('=== API Endpoints ที่ใช้ได้ ===\n');

console.log('🔐 USER/AUTH APIs:');
console.log('GET    ' + baseUrl + '/api/users                    - ดึงผู้ใช้งานทั้งหมด');
console.log('GET    ' + baseUrl + '/api/users/admin              - ดึงผู้ใช้งาน role admin');
console.log('GET    ' + baseUrl + '/api/users/user               - ดึงผู้ใช้งาน role user');
console.log('POST   ' + baseUrl + '/api/users/login              - เข้าสู่ระบบ');
console.log('POST   ' + baseUrl + '/api/users/logout             - ออกจากระบบ');
console.log('POST   ' + baseUrl + '/api/users/register           - ลงทะเบียน');
console.log('POST   ' + baseUrl + '/api/users/changepassword     - เปลี่ยนรหัสผ่าน');
console.log('POST   ' + baseUrl + '/api/users/forgotpassword     - รีเซ็ตรหัสผ่าน');
console.log('DELETE ' + baseUrl + '/api/users/:id                - ลบผู้ใช้งาน');

console.log('\n👤 PERSON APIs:');
console.log('GET    ' + baseUrl + '/api/persons                  - ดึงข้อมูลบุคคลทั้งหมด');
console.log('GET    ' + baseUrl + '/api/persons/:id              - ดึงข้อมูลบุคคลตาม ID');
console.log('POST   ' + baseUrl + '/api/persons                  - สร้างข้อมูลบุคคลใหม่');
console.log('PUT    ' + baseUrl + '/api/persons/:id              - แก้ไขข้อมูลบุคคล');
console.log('DELETE ' + baseUrl + '/api/persons/:id              - ลบข้อมูลบุคคล');

console.log('\n📝 ตัวอย่างการใช้งาน:');
console.log('curl -X POST ' + baseUrl + '/api/users/register -H "Content-Type: application/json" -d \'{"username":"test","password":"123","email":"test@test.com","firstName":"Test","lastName":"User"}\'');
console.log('curl -X POST ' + baseUrl + '/api/users/login -H "Content-Type: application/json" -d \'{"username":"test","password":"123"}\'');
console.log('curl -X GET ' + baseUrl + '/api/users');
console.log('curl -X GET ' + baseUrl + '/api/persons');