# 🔍 การทำงานของ API แต่ละตัวอย่างละเอียดที่สุด

## 📋 สารบัญ
1. [Authentication APIs](#authentication-apis)
2. [Person Management APIs](#person-management-apis)
3. [Middleware Functions](#middleware-functions)
4. [Helper Functions](#helper-functions)

---

## 🧹 การอัพเดทล่าสุด (Cleanup)
- ✅ ลบระบบ Admin Reset ที่ไม่จำเป็นออกแล้ว
- ✅ ลบไฟล์ adminReset.js และ routes ที่เกี่ยวข้อง
- ✅ ทำความสะอาดโค้ดที่ซ้ำซ้อน
- ✅ ระบบใช้การยืนยันตัวตนแบบง่าย (username + email + phone) สำหรับรีเซ็ตรหัสผ่าน

---

# 🔐 Authentication APIs

## 1. 📝 register.js - สมัครสมาชิก

### 🎯 หน้าที่หลัก
สร้างบัญชีผู้ใช้ใหม่ในระบบ พร้อมเข้ารหัสรหัสผ่าน

### 📥 Input Parameters
```javascript
const { id, username, password, email, firstName, lastName, phone, age, role } = req.body;
```

### 🔄 ขั้นตอนการทำงาน (ทีละบรรทัด)

#### 1. Import Dependencies
```javascript
const User = require('../../models/User');     // โมเดลผู้ใช้
const bcrypt = require('bcrypt');              // ไลบรารีเข้ารหัส
```

#### 2. ฟังก์ชันหลัก register()
```javascript
async function register(req, res) {
```
- **async:** ใช้ async/await สำหรับ database operations
- **req:** ข้อมูลที่ส่งมาจาก client
- **res:** object สำหรับส่งผลลัพธ์กลับ

#### 3. Destructuring Input Data
```javascript
const { id, username, password, email, firstName, lastName, phone, age, role } = req.body;
```

**การทำงานของ req.body แบบละเอียด:**

**req (Request Object):**
- **ประเภท:** Express.js Request Object
- **ที่มา:** สร้างโดย Express เมื่อมี HTTP request เข้ามา
- **ข้อมูลที่มี:**
  - `req.method` - HTTP method (GET, POST, PUT, DELETE)
  - `req.url` - URL path ที่เรียก
  - `req.headers` - HTTP headers ทั้งหมด
  - `req.params` - URL parameters (เช่น /users/:id)
  - `req.query` - Query string parameters (เช่น ?name=john)
  - `req.body` - Request body data
  - `req.cookies` - Cookies ที่ส่งมา
  - `req.ip` - IP address ของผู้ส่ง

**req.body:**
- **ที่มา:** ข้อมูลที่ส่งมาใน HTTP request body
- **การประมวลผล:** ผ่าน middleware `express.json()` และ `express.urlencoded()`
- **รูปแบบข้อมูล:** JavaScript Object
- **ตัวอย่าง raw data:**
  ```
  POST /api/users/register
  Content-Type: application/json
  
  {
    "username": "newuser",
    "password": "1234",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
  ```
- **หลังผ่าน middleware:** กลายเป็น JavaScript Object
  ```javascript
  req.body = {
    username: "newuser",
    password: "1234", 
    email: "user@example.com",
    firstName: "John",
    lastName: "Doe"
  }
  ```

**Destructuring Assignment:**
- **ES6 syntax:** แยกค่าจาก object ออกเป็นตัวแปรแยก
- **การทำงาน:**
  ```javascript
  // แทนที่จะเขียนแบบนี้
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  
  // ใช้ destructuring แทน
  const { username, password, email } = req.body;
  ```
- **ข้อดี:** โค้ดสั้นลง อ่านง่าย
- **undefined handling:** ถ้าไม่มีฟิลด์นั้นใน req.body จะได้ค่า undefined

**ตัวแปรที่ได้:**
- **id:** อาจเป็น undefined (ไม่บังคับ)
- **username:** string - ชื่อผู้ใช้
- **password:** string - รหัสผ่าน plain text
- **email:** string - อีเมล
- **firstName:** string - ชื่อจริง
- **lastName:** string - นามสกุล
- **phone:** อาจเป็น undefined (ไม่บังคับ)
- **age:** อาจเป็น undefined (ไม่บังคับ)
- **role:** อาจเป็น undefined (ไม่บังคับ)
#### 4. Validation - ตรวจสอบข้อมูลบังคับ

```javascript
if (!username) {
  return res.status(400).json({ error: 'กรุณาระบุชื่อผู้ใช้งาน' });
}
```
- **!username:** ตรวจสอบว่า username เป็น null, undefined, หรือ empty string
- **return:** หยุดการทำงานทันทีถ้าไม่ผ่าน
- **status(400):** HTTP Bad Request
- **json():** ส่งผลลัพธ์เป็น JSON format

```javascript
if (!password) {
  return res.status(400).json({ error: 'กรุณาระบุรหัสผ่าน' });
}
if (!email) {
  return res.status(400).json({ error: 'กรุณาระบุอีเมล' });
}
if (!firstName) {
  return res.status(400).json({ error: 'กรุณาระบุชื่อ' });
}
if (!lastName) {
  return res.status(400).json({ error: 'กรุณาระบุนามสกุล' });
}
```
- **ตรวจสอบทีละฟิลด์:** แต่ละฟิลด์บังคับ
- **Early return pattern:** หยุดทันทีเมื่อเจอข้อผิดพลาด

#### 5. Duplicate Check - ตรวจสอบข้อมูลซ้ำ

```javascript
const existUser = await User.findOne({ username: username });
if (existUser) {
  return res.status(400).json({ error: 'ชื่อผู้ใช้งานนี้ถูกใช้งานแล้ว' });
}
```

**การทำงานของ User.findOne() แบบละเอียด:**

**User Model:**
- **ประเภท:** Mongoose Model
- **ที่มา:** require('../../models/User')
- **การเชื่อมต่อ:** เชื่อมต่อกับ MongoDB collection ชื่อ "users"
- **Schema:** กำหนดโครงสร้างข้อมูลใน User.js

**findOne() Method:**
- **ประเภท:** Mongoose Query Method
- **การทำงาน:** ค้นหาเอกสาร (document) แรกที่ตรงกับเงื่อนไข
- **return type:** Promise<Document | null>
- **MongoDB operation:** db.users.findOne({ username: "newuser" })

**Query Object { username: username }:**
- **รูปแบบ:** MongoDB query filter
- **เงื่อนไข:** หาเอกสารที่มี field "username" เท่ากับค่าในตัวแปร username
- **การเปรียบเทียบ:** exact match (ตรงกันทุกตัวอักษร)
- **case sensitive:** แยกตัวพิมพ์เล็ก-ใหญ่
- **ตัวอย่าง:** ถ้า username = "JohnDoe" จะหาเฉพาะ "JohnDoe" ไม่ใช่ "johndoe"

**await keyword:**
- **asynchronous operation:** findOne() เป็น Promise-based
- **network operation:** ต้องส่ง query ไป MongoDB server
- **blocking behavior:** รอผลลัพธ์ก่อนไปบรรทัดถัดไป
- **error handling:** ถ้า query ล้มเหลว จะ throw error

**existUser result:**
- **กรณีเจอข้อมูล:** JavaScript Object ที่มีข้อมูลผู้ใช้
  ```javascript
  existUser = {
    _id: ObjectId("..."),
    username: "newuser",
    password: "$2b$10$...",
    email: "user@example.com",
    firstName: "John",
    lastName: "Doe",
    createdAt: Date,
    updatedAt: Date
  }
  ```
- **กรณีไม่เจอ:** null
- **การตรวจสอบ:** if (existUser) จะเป็น true ถ้าเจอข้อมูล

**if (existUser) condition:**
- **truthy check:** ตรวจสอบว่า existUser เป็น truthy value หรือไม่
- **null = falsy:** ถ้าไม่เจอข้อมูล existUser จะเป็น null (falsy)
- **object = truthy:** ถ้าเจอข้อมูล existUser จะเป็น object (truthy)
- **การทำงาน:** เข้า if block เฉพาะเมื่อพบข้อมูลซ้ำ

```javascript
const existEmail = await User.findOne({ email: email });
if (existEmail) {
  return res.status(400).json({ error: 'อีเมลนี้ถูกใช้งานแล้ว' });
}
```

**การตรวจสอบอีเมลซ้ำ:**
- **เหมือนกับ username:** ใช้ findOne() แบบเดียวกัน
- **query filter:** { email: email }
- **MongoDB operation:** db.users.findOne({ email: "user@example.com" })
- **การเปรียบเทียบ:** exact match, case sensitive
- **ผลลัพธ์:** existEmail จะเป็น object หรือ null

#### 6. Password Hashing - เข้ารหัสรหัสผ่าน

```javascript
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(password, saltRounds);
```

**การทำงานของ bcrypt.hash() แบบละเอียด:**

**saltRounds = 10:**
- **ความหมาย:** จำนวนรอบการเข้ารหัส = 2^10 = 1,024 รอบ
- **การคำนวณ:** bcrypt จะทำการ hash ซ้ำๆ 1,024 ครั้ง
- **เวลาที่ใช้:** ประมาณ 100-200 มิลลิวินาที (ขึ้นอยู่กับ CPU)
- **ความปลอดภัย:** ยิ่งสูงยิ่งปลอดภัย แต่ใช้เวลานานขึ้น
- **แนะนำ:** 10-12 สำหรับระบบปัจจุบัน

**bcrypt.hash(password, saltRounds):**
- **parameter 1 (password):** รหัสผ่าน plain text ที่ผู้ใช้ป้อน
- **parameter 2 (saltRounds):** จำนวนรอบการเข้ารหัส
- **salt generation:** bcrypt สร้าง random salt 16 bytes อัตโนมัติ
- **hashing process:** 
  1. สร้าง salt แบบสุ่ม
  2. ผสม password + salt
  3. ทำ hash ตามจำนวนรอบที่กำหนด
  4. รวม salt + hash เป็น string เดียว
- **output format:** "$2b$10$[22-char-salt][31-char-hash]"
- **ตัวอย่าง output:** "$2b$10$N9qo8uLOickgx2ZMRZoMye.IjdQXvbVxVv0VerUPtRa.hSqJyU7C2"

**await keyword:**
- **asynchronous operation:** bcrypt.hash() เป็น Promise-based function
- **blocking behavior:** รอให้การเข้ารหัสเสร็จก่อนไปบรรทัดถัดไป
- **CPU intensive:** การเข้ารหัสใช้ CPU สูง จึงต้องใช้ await
- **error handling:** ถ้า hash ล้มเหลว จะ throw error ไปที่ catch block

**hashedPassword result:**
- **ประเภท:** string ความยาว 60 ตัวอักษร
- **โครงสร้าง:** $algorithm$cost$salt+hash
- **algorithm:** $2b$ = bcrypt version 2b
- **cost:** $10$ = saltRounds ที่ใช้
- **salt:** 22 ตัวอักษรแรก (base64 encoded)
- **hash:** 31 ตัวอักษรสุดท้าย (base64 encoded)
- **one-way:** ไม่สามารถถอดรหัสกลับเป็น plain text ได้
- **unique:** รหัสผ่านเดียวกันจะได้ hash ต่างกันเพราะ salt สุ่ม
#### 7. Create User Object - สร้าง Object ผู้ใช้

```javascript
const newUser = new User({
  id: id || '', 
  username: username, 
  password: hashedPassword, 
  email: email, 
  firstName: firstName, 
  lastName: lastName,
  phone: phone,
  age: age,
  role: role || 'user'
});
```
- **new User():** สร้าง instance ใหม่ของ User model
- **id: id || '':** ใช้ id ที่ส่งมา หรือ empty string ถ้าไม่มี
- **password: hashedPassword:** ใช้รหัสที่เข้ารหัสแล้ว (ไม่ใช่ plain text)
- **role: role || 'user':** ใช้ role ที่ส่งมา หรือ 'user' เป็น default
- **phone, age:** อาจเป็น undefined ถ้าไม่ส่งมา (ไม่เป็นไร)

#### 8. Save to Database - บันทึกลงฐานข้อมูล

```javascript
const savedUser = await newUser.save();
```

**การทำงานของ .save() แบบละเอียด:**

**newUser.save():**
- **ประเภท:** Mongoose Document Method
- **การทำงาน:** บันทึกเอกสารลงฐานข้อมูล
- **return type:** Promise<Document>
- **MongoDB operation:** db.users.insertOne(document)

**Pre-save Processing:**
1. **Validation:** ตรวจสอบ schema constraints
   - Required fields check
   - Data type validation  
   - Custom validators
   - Unique constraints
2. **Middleware execution:** รัน pre-save hooks
   - Password hashing (ถ้ามี)
   - Data transformation
   - Audit logging
3. **Default values:** ใส่ค่า default สำหรับ fields ที่ไม่มี
4. **Timestamps:** เพิ่ม createdAt และ updatedAt อัตโนมัติ

**การทำงานภายใน:**
1. **Document preparation:** เตรียมเอกสารสำหรับบันทึก
2. **Schema validation:** ตรวจสอบตาม User schema
3. **Database insertion:** ส่งคำสั่ง insertOne ไป MongoDB
4. **_id generation:** MongoDB สร้าง ObjectId อัตโนมัติ
5. **Return document:** ส่งเอกสารที่บันทึกแล้วกลับมา

**savedUser result:**
```javascript
savedUser = {
  _id: ObjectId("507f1f77bcf86cd799439011"),  // สร้างอัตโนมัติ
  id: "",                                      // ค่าที่ส่งมา หรือ ""
  username: "newuser",
  password: "$2b$10$N9qo8uLOickgx2ZMRZoMye...", // เข้ารหัสแล้ว
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  phone: undefined,                            // ถ้าไม่ส่งมา
  age: undefined,                              // ถ้าไม่ส่งมา  
  role: "user",                               // default value
  createdAt: Date("2024-01-15T10:30:00.000Z"), // สร้างอัตโนมัติ
  updatedAt: Date("2024-01-15T10:30:00.000Z"), // สร้างอัตโนมัติ
  __v: 0                                       // version key
}
```

**Error Handling:**
- **Validation errors:** ถ้าข้อมูลไม่ผ่าน validation
  ```javascript
  ValidationError: User validation failed: 
    email: Path `email` is required.
  ```
- **Duplicate key errors:** ถ้า username หรือ email ซ้ำ
  ```javascript
  MongoError: E11000 duplicate key error collection: 
    mydb.users index: username_1 dup key: { username: "newuser" }
  ```
- **Connection errors:** ถ้าไม่ได้เชื่อมต่อฐานข้อมูล
  ```javascript
  MongoNetworkError: failed to connect to server
  ```

**await keyword:**
- **asynchronous operation:** save() เป็น Promise-based
- **database operation:** ต้องส่งข้อมูลไป MongoDB server
- **blocking behavior:** รอการบันทึกเสร็จก่อนไปบรรทัดถัดไป
- **error handling:** ถ้าบันทึกล้มเหลว จะ throw error

**Performance Considerations:**
- **network latency:** ขึ้นอยู่กับระยะทางไป database server
- **validation overhead:** การตรวจสอบ schema ใช้เวลา
- **index updates:** MongoDB ต้องอัปเดต indexes
- **write concern:** การรอยืนยันการเขียน

#### 9. Success Response - ส่งผลลัพธ์สำเร็จ

```javascript
res.status(201).json({
  message: 'ลงทะเบียนสมาชิกเรียบร้อยแล้ว',
  user: {
    username: savedUser.username,
    email: savedUser.email,
    firstName: savedUser.firstName,
    lastName: savedUser.lastName,
    role: savedUser.role
  }
});
```
- **status(201):** HTTP Created (สร้างสำเร็จ)
- **message:** ข้อความแจ้งผลลัพธ์
- **user object:** ข้อมูลผู้ใช้ที่สร้างแล้ว (ไม่รวมรหัสผ่าน)
- **ไม่ส่ง password:** เพื่อความปลอดภัย

#### 10. Error Handling - จัดการข้อผิดพลาด

```javascript
} catch (error) {
  console.error('เกิดข้อผิดพลาดในการลงทะเบียน:', error);
  res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลงทะเบียน' });
}
```
- **catch block:** จับ error ที่เกิดขึ้นใน try block
- **console.error():** แสดง error ใน server log
- **status(500):** HTTP Internal Server Error
- **generic error message:** ไม่เปิดเผยรายละเอียด error ให้ client

---

## 2. 🔑 login.js - เข้าสู่ระบบ

### 🎯 หน้าที่หลัก
ตรวจสอบข้อมูลผู้ใช้และจัดการสถานะการเข้าสู่ระบบ

### 📥 Input Parameters
```javascript
const { username, email, password } = req.body;
```

### 🔄 ขั้นตอนการทำงาน (ทีละบรรทัด)
#### 1. Import Dependencies
```javascript
const User = require('../../models/User');
const LoggedInUser = require('../../models/LoggedInUser');
const bcrypt = require('bcrypt');
```
- **User:** โมเดลข้อมูลผู้ใช้
- **LoggedInUser:** โมเดลสถานะการเข้าสู่ระบบ
- **bcrypt:** สำหรับตรวจสอบรหัสผ่าน

#### 2. Database Connection Check
```javascript
const mongoose = require('mongoose');
if (mongoose.connection.readyState !== 1) {
  console.error('Database connection state:', mongoose.connection.readyState);
  return res.status(500).json({ error: 'ไม่ได้เชื่อมต่อDatabase' });
}
```
- **mongoose.connection.readyState:** สถานะการเชื่อมต่อ DB
  - 0 = disconnected
  - 1 = connected
  - 2 = connecting
  - 3 = disconnecting
- **!== 1:** ถ้าไม่ใช่ connected ให้หยุดทำงาน

#### 3. Input Processing
```javascript
const { username, email, password } = req.body;
const usernameOrEmail = username || email;
```

**การทำงานของ req.body ใน login.js แบบละเอียด:**

**req.body structure:**
- **ที่มา:** HTTP POST request body
- **Content-Type:** application/json หรือ application/x-www-form-urlencoded
- **ตัวอย่าง JSON:**
  ```json
  {
    "username": "john123",
    "password": "mypassword"
  }
  ```
- **ตัวอย่าง form-data:**
  ```
  username=john123&password=mypassword
  ```

**Destructuring assignment:**
```javascript
const { username, email, password } = req.body;
```
- **username:** อาจเป็น string หรือ undefined
- **email:** อาจเป็น string หรือ undefined  
- **password:** อาจเป็น string หรือ undefined

**Logical OR operator (||):**
```javascript
const usernameOrEmail = username || email;
```

**การทำงานของ || operator:**
- **left-to-right evaluation:** ตรวจสอบจากซ้ายไปขวา
- **truthy check:** ถ้าค่าซ้ายเป็น truthy ใช้ค่าซ้าย
- **falsy fallback:** ถ้าค่าซ้ายเป็น falsy ใช้ค่าขวา

**Falsy values ใน JavaScript:**
- `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`

**ตัวอย่างการทำงาน:**
```javascript
// กรณีที่ 1: มี username
req.body = { username: "john123", password: "pass" }
const { username, email, password } = req.body;
// username = "john123", email = undefined, password = "pass"
const usernameOrEmail = username || email;
// usernameOrEmail = "john123" (เพราะ "john123" เป็น truthy)

// กรณีที่ 2: มี email
req.body = { email: "john@example.com", password: "pass" }
const { username, email, password } = req.body;
// username = undefined, email = "john@example.com", password = "pass"
const usernameOrEmail = username || email;
// usernameOrEmail = "john@example.com" (เพราะ undefined เป็น falsy)

// กรณีที่ 3: มีทั้งคู่
req.body = { username: "john123", email: "john@example.com", password: "pass" }
const { username, email, password } = req.body;
// username = "john123", email = "john@example.com", password = "pass"
const usernameOrEmail = username || email;
// usernameOrEmail = "john123" (เพราะ username มาก่อนและเป็น truthy)

// กรณีที่ 4: ไม่มีทั้งคู่
req.body = { password: "pass" }
const { username, email, password } = req.body;
// username = undefined, email = undefined, password = "pass"
const usernameOrEmail = username || email;
// usernameOrEmail = undefined (เพราะทั้งคู่เป็น falsy)
```

**ประโยชน์ของ pattern นี้:**
- **flexibility:** รองรับทั้ง username และ email login
- **backward compatibility:** ถ้า client ส่งมาแค่ username ก็ใช้ได้
- **forward compatibility:** ถ้า client ส่งมาแค่ email ก็ใช้ได้
- **priority:** ให้ความสำคัญกับ username ก่อน (ถ้ามีทั้งคู่)

#### 4. Input Validation
```javascript
if (!usernameOrEmail) {
  return res.status(400).json({ error: 'กรุณาระบุชื่อผู้ใช้งานหรืออีเมล' });
}
if (!password) {
  return res.status(400).json({ error: 'กรุณากรอกรหัสผ่าน' });
}
```
- **ตรวจสอบข้อมูลบังคับ:** ต้องมีทั้ง username/email และ password

#### 5. User Lookup - ค้นหาผู้ใช้
```javascript
const user = await User.findOne({
  $or: [
    { username: usernameOrEmail },
    { email: usernameOrEmail }
  ]
});
```

**การทำงานของ MongoDB $or Operator แบบละเอียด:**

**User.findOne() with $or:**
- **User Model:** Mongoose model ที่เชื่อมต่อกับ collection "users"
- **findOne():** ค้นหาเอกสารแรกที่ตรงเงื่อนไข
- **$or operator:** MongoDB operator สำหรับ OR condition

**$or Query Structure:**
```javascript
{
  $or: [
    { username: usernameOrEmail },
    { email: usernameOrEmail }
  ]
}
```

**การทำงานของ $or:**
- **array of conditions:** รับ array ของเงื่อนไขต่างๆ
- **OR logic:** ถ้าเงื่อนไขใดเงื่อนไขหนึ่งเป็นจริง ก็ถือว่าตรงเงื่อนไข
- **MongoDB query:** db.users.findOne({ $or: [...] })

**Condition 1: { username: usernameOrEmail }**
- **field matching:** หา document ที่มี field "username" 
- **value comparison:** เท่ากับค่าในตัวแปร usernameOrEmail
- **exact match:** ต้องตรงกันทุกตัวอักษร
- **case sensitive:** แยกตัวพิมพ์เล็ก-ใหญ่

**Condition 2: { email: usernameOrEmail }**
- **field matching:** หา document ที่มี field "email"
- **value comparison:** เท่ากับค่าในตัวแปร usernameOrEmail
- **exact match:** ต้องตรงกันทุกตัวอักษร
- **case sensitive:** แยกตัวพิมพ์เล็ก-ใหญ่

**ตัวอย่างการทำงาน:**
```javascript
// ถ้า usernameOrEmail = "john123"
// MongoDB จะค้นหา:
{
  $or: [
    { username: "john123" },  // หาใน username field
    { email: "john123" }      // หาใน email field
  ]
}

// ถ้า usernameOrEmail = "john@example.com"  
// MongoDB จะค้นหา:
{
  $or: [
    { username: "john@example.com" },  // หาใน username field
    { email: "john@example.com" }      // หาใน email field
  ]
}
```

**ผลลัพธ์ที่เป็นไปได้:**
1. **เจอใน username field:** return user document
2. **เจอใน email field:** return user document  
3. **เจอทั้งสองที่:** return document แรกที่เจอ
4. **ไม่เจอเลย:** return null

**user variable result:**
- **กรณีเจอ:** JavaScript Object ที่มีข้อมูลผู้ใช้
  ```javascript
  user = {
    _id: ObjectId("..."),
    username: "john123",
    password: "$2b$10$...",
    email: "john@example.com",
    firstName: "John",
    lastName: "Doe",
    role: "user",
    createdAt: Date,
    updatedAt: Date
  }
  ```
- **กรณีไม่เจอ:** null

**ข้อดีของ $or query:**
- **flexibility:** ผู้ใช้สามารถใส่ username หรือ email ก็ได้
- **single query:** ทำใน query เดียว ไม่ต้องค้นหาสองครั้ง
- **performance:** MongoDB optimize query อัตโนมัติ
- **user experience:** ผู้ใช้ไม่ต้องจำว่าสมัครด้วย username หรือ email

#### 6. User Existence Check
```javascript
if (!user) {
  return res.status(400).json({ error: 'ไม่พบชื่อผู้ใช้งานหรืออีเมลนี้' });
}
```
- **!user:** ถ้า findOne() return null แสดงว่าไม่เจอ
- **security note:** ไม่บอกว่าไม่เจอ username หรือ email เพื่อป้องกัน enumeration attack
#### 7. Password Verification - ตรวจสอบรหัสผ่าน
```javascript
const isPasswordValid = await bcrypt.compare(password, user.password);
if (!isPasswordValid) {
  return res.status(400).json({ error: 'รหัสผ่านไม่ถูกต้อง' });
}
```

**การทำงานของ bcrypt.compare() แบบละเอียด:**

**bcrypt.compare(plaintext, hash):**
- **parameter 1 (password):** รหัสผ่าน plain text ที่ผู้ใช้ป้อนเข้ามา
  - ประเภท: string
  - ตัวอย่าง: "1234"
  - ไม่ได้เข้ารหัส: เป็น plain text ธรรมดา
- **parameter 2 (user.password):** รหัสผ่านที่เข้ารหัสแล้วในฐานข้อมูล
  - ประเภท: string (60 ตัวอักษร)
  - รูปแบบ: "$2b$10$[salt][hash]"
  - ตัวอย่าง: "$2b$10$N9qo8uLOickgx2ZMRZoMye.IjdQXvbVxVv0VerUPtRa.hSqJyU7C2"

**กระบวนการเปรียบเทียบ:**
1. **Extract salt:** bcrypt แยก salt จาก hash string
   - salt = "N9qo8uLOickgx2ZMRZoMye"
   - cost = 10 (จาก $10$)
2. **Hash input password:** เอา plain text password มา hash ด้วย salt เดียวกัน
   - ใช้ salt และ cost เดียวกับตอนสร้าง
   - ทำ hash "1234" + salt ด้วย 2^10 รอบ
3. **Compare results:** เปรียบเทียบ hash ที่ได้กับ hash ในฐานข้อมูล
   - ถ้าเหมือนกัน = รหัสผ่านถูกต้อง
   - ถ้าต่างกัน = รหัสผ่านผิด

**การทำงานภายใน:**
- **deterministic:** salt เดียวกัน + password เดียวกัน = hash เดียวกัน
- **timing attack resistant:** ใช้เวลาเท่ากันไม่ว่าจะถูกหรือผิด
- **CPU intensive:** ใช้เวลาประมาณ 100-200ms
- **secure comparison:** ใช้ constant-time comparison

**await keyword:**
- **asynchronous:** bcrypt.compare() เป็น Promise-based function
- **CPU intensive:** การ hash ใช้ CPU สูง จึงทำแบบ async
- **non-blocking:** ไม่บล็อก event loop ของ Node.js
- **error handling:** ถ้าเกิด error จะ throw ไปที่ catch block

**isPasswordValid result:**
- **ประเภท:** boolean
- **true:** รหัสผ่านถูกต้อง (hash ตรงกัน)
- **false:** รหัสผ่านผิด (hash ไม่ตรงกัน)
- **ไม่มีค่าอื่น:** จะได้เฉพาะ true หรือ false เท่านั้น

**!isPasswordValid condition:**
- **logical NOT:** กลับค่า boolean
- **true → false:** ถ้ารหัสผ่านถูก จะไม่เข้า if
- **false → true:** ถ้ารหัสผ่านผิด จะเข้า if block
- **security:** ส่ง error message ที่ไม่เปิดเผยรายละเอียด

#### 8. Login State Management - จัดการสถานะการเข้าสู่ระบบ
```javascript
try {
  const existingLogin = await LoggedInUser.findOne({ username: user.username });
```

**การทำงานของ LoggedInUser.findOne() แบบละเอียด:**

**LoggedInUser Model:**
- **ประเภท:** Mongoose Model
- **collection:** "loggedinusers" ใน MongoDB
- **schema:** กำหนดใน models/LoggedInUser.js
- **หน้าที่:** เก็บสถานะการ login ของผู้ใช้

**findOne({ username: user.username }):**
- **query filter:** { username: user.username }
- **user.username:** ค่า username จาก User document ที่เจอในขั้นตอนก่อนหน้า
- **exact match:** ค้นหา username ที่ตรงกันทุกตัวอักษร
- **MongoDB operation:** db.loggedinusers.findOne({ username: "john123" })

**ตัวอย่าง user.username:**
```javascript
// จากขั้นตอนก่อนหน้า user = {...}
user = {
  _id: ObjectId("..."),
  username: "john123",  // ← ค่านี้จะถูกใช้ใน query
  email: "john@example.com",
  // ... fields อื่นๆ
}

// query ที่เกิดขึ้น
LoggedInUser.findOne({ username: "john123" })
```

**existingLogin result possibilities:**
1. **มี login record อยู่แล้ว:**
   ```javascript
   existingLogin = {
     _id: ObjectId("..."),
     username: "john123",
     loginTime: Date("2024-01-15T10:30:00.000Z"),
     createdAt: Date("2024-01-15T10:30:00.000Z"),
     updatedAt: Date("2024-01-15T10:30:00.000Z")
   }
   ```

2. **ไม่มี login record:**
   ```javascript
   existingLogin = null
   ```

**nested try-catch block:**
```javascript
try {
  // outer try block (main function)
  try {
    // inner try block (login state management)
    const existingLogin = await LoggedInUser.findOne({ username: user.username });
    // ... login state logic
  } catch (loginStateError) {
    // inner catch block (login state errors only)
  }
} catch (error) {
  // outer catch block (general errors)
}
```

**เหตุผลของ nested try-catch:**
- **error isolation:** แยก error ของ login state จาก error อื่นๆ
- **specific handling:** จัดการ error แต่ละประเภทต่างกัน
- **graceful degradation:** ถ้า login state ล้มเหลว ยังส่ง error ได้
- **debugging:** ง่ายต่อการ debug เพราะรู้ว่า error มาจากไหน

#### 9. Update Existing Login - อัปเดตการ login ที่มีอยู่
```javascript
if (existingLogin) {
  existingLogin.loginTime = new Date();
  await existingLogin.save();
  console.log(`อัปเดตสถานะ login สำหรับ user: ${user.username}`);
}
```

**การทำงานของ existingLogin.save() แบบละเอียด:**

**Document Update Pattern:**
- **existingLogin:** Mongoose Document instance ที่ได้จาก findOne()
- **field modification:** เปลี่ยนค่า loginTime field
- **save() method:** บันทึกการเปลี่ยนแปลงลงฐานข้อมูล

**new Date():**
- **ประเภท:** JavaScript Date constructor
- **การทำงาน:** สร้าง Date object ของเวลาปัจจุบัน
- **timezone:** ใช้ timezone ของเซิร์ฟเวอร์
- **format:** ISO 8601 format (2024-01-15T10:30:00.000Z)
- **precision:** มีความแม่นยำถึงมิลลิวินาที

**existingLogin.loginTime = new Date():**
- **field assignment:** กำหนดค่าใหม่ให้ loginTime field
- **mongoose tracking:** Mongoose ติดตามการเปลี่ยนแปลง
- **dirty flag:** ทำเครื่องหมายว่า document มีการเปลี่ยนแปลง
- **validation:** ตรวจสอบตาม schema constraints

**existingLogin.save():**
- **ประเภท:** Mongoose Document Method
- **การทำงาน:** อัปเดตเอกสารที่มีอยู่ในฐานข้อมูล
- **return type:** Promise<Document>
- **MongoDB operation:** db.loggedinusers.updateOne({ _id: ... }, { $set: { loginTime: ... } })

**การทำงานภายใน:**
1. **Change detection:** ตรวจสอบ fields ที่เปลี่ยนแปลง
2. **Validation:** ตรวจสอบข้อมูลใหม่ตาม schema
3. **Pre-save hooks:** รัน middleware ก่อนบันทึก
4. **Database update:** ส่งคำสั่ง updateOne ไป MongoDB
5. **Post-save hooks:** รัน middleware หลังบันทึก
6. **Return document:** ส่งเอกสารที่อัปเดตแล้วกลับมา

**MongoDB Update Operation:**
```javascript
// คำสั่งที่ MongoDB ได้รับ
db.loggedinusers.updateOne(
  { _id: ObjectId("...") },
  { 
    $set: { 
      loginTime: Date("2024-01-15T11:00:00.000Z"),
      updatedAt: Date("2024-01-15T11:00:00.000Z")  // อัปเดตอัตโนมัติ
    }
  }
)
```

**console.log() Template Literal:**
```javascript
console.log(`อัปเดตสถานะ login สำหรับ user: ${user.username}`);
```
- **template literal:** ใช้ backticks (`) แทน quotes
- **string interpolation:** ใช้ ${} เพื่อแทรกตัวแปร
- **user.username:** ค่า username จาก User document
- **output example:** "อัปเดตสถานะ login สำหรับ user: john123"

**ข้อดีของ Pattern นี้:**
- **efficient update:** อัปเดตเฉพาะ fields ที่เปลี่ยน
- **atomic operation:** การอัปเดตเป็น atomic
- **audit trail:** บันทึกเวลาการ login ล่าสุด
- **session management:** ติดตามสถานะการใช้งาน

#### 10. Create New Login - สร้างการ login ใหม่
```javascript
} else {
  const loggedInUser = new LoggedInUser({ username: user.username });
  await loggedInUser.save();
  console.log(`สร้างสถานะ login ใหม่สำหรับ user: ${user.username}`);
}
```

**การทำงานของ new LoggedInUser() แบบละเอียด:**

**LoggedInUser Constructor:**
- **ประเภท:** Mongoose Model Constructor
- **การทำงาน:** สร้าง Document instance ใหม่
- **parameter:** JavaScript object ที่มีข้อมูลเริ่มต้น
- **schema application:** ใช้ schema จาก models/LoggedInUser.js

**Constructor Parameter { username: user.username }:**
- **object literal:** สร้าง object ด้วย property เดียว
- **username field:** กำหนดค่า username จาก user.username
- **user.username:** ค่า username จาก User document ที่เจอในขั้นตอนก่อนหน้า
- **data binding:** เชื่อมโยงข้อมูลระหว่าง User และ LoggedInUser

**Document Creation Process:**
1. **Schema validation:** ตรวจสอบข้อมูลตาม LoggedInUser schema
2. **Default values:** ใส่ค่า default สำหรับ fields ที่ไม่ได้ระบุ
   - `loginTime: Date.now()` (default ใน schema)
   - `createdAt: Date.now()` (timestamps: true)
   - `updatedAt: Date.now()` (timestamps: true)
3. **Field assignment:** กำหนดค่าให้ fields ต่างๆ
4. **Instance creation:** สร้าง Document instance

**loggedInUser object structure:**
```javascript
loggedInUser = {
  // ยังไม่มี _id (จะได้เมื่อ save())
  username: "john123",                         // จาก parameter
  loginTime: Date("2024-01-15T11:00:00.000Z"), // default value
  createdAt: Date("2024-01-15T11:00:00.000Z"), // timestamps
  updatedAt: Date("2024-01-15T11:00:00.000Z"), // timestamps
  // Mongoose internal properties
  $isNew: true,                                // บอกว่าเป็น document ใหม่
  $__: { ... }                                 // internal state
}
```

**loggedInUser.save():**
- **ประเภท:** Mongoose Document Method
- **การทำงาน:** บันทึก document ใหม่ลงฐานข้อมูล
- **return type:** Promise<Document>
- **MongoDB operation:** db.loggedinusers.insertOne(document)

**Save Process:**
1. **Pre-save validation:** ตรวจสอบข้อมูลตาม schema
2. **Unique constraints:** ตรวจสอบ username ไม่ซ้ำ (ถ้ามี unique index)
3. **Document insertion:** ส่งคำสั่ง insertOne ไป MongoDB
4. **_id generation:** MongoDB สร้าง ObjectId อัตโนมัติ
5. **Return document:** ส่ง document ที่บันทึกแล้วกลับมา

**Final saved document:**
```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439012"),   // สร้างอัตโนมัติ
  username: "john123",
  loginTime: Date("2024-01-15T11:00:00.000Z"),
  createdAt: Date("2024-01-15T11:00:00.000Z"),
  updatedAt: Date("2024-01-15T11:00:00.000Z"),
  __v: 0                                       // version key
}
```

**Error Handling:**
- **Duplicate username:** ถ้า username ซ้ำ (มี unique constraint)
- **Validation errors:** ถ้าข้อมูลไม่ผ่าน schema validation
- **Connection errors:** ถ้าไม่ได้เชื่อมต่อฐานข้อมูล

**Business Logic:**
- **session tracking:** เริ่มติดตาม session ใหม่
- **login audit:** บันทึกการเข้าสู่ระบบ
- **concurrent login prevention:** ป้องกันการ login ซ้ำ (ถ้ามี logic เพิ่ม)

#### 11. Login State Error Handling
```javascript
} catch (loginStateError) {
  console.error('เกิดข้อผิดพลาดในการจัดการสถานะ login:', loginStateError);
  console.error('Error details:', {
    name: loginStateError.name,
    message: loginStateError.message,
    code: loginStateError.code
  });
  return res.status(500).json({ 
    error: 'ไม่สามารถบันทึกสถานะการเข้าสู่ระบบได้',
    details: loginStateError.message 
  });
}
```
- **detailed logging:** บันทึก error แบบละเอียด
- **error.name, message, code:** ข้อมูล error ที่สำคัญ
- **return with details:** ส่ง error message กลับไป
#### 12. Success Response - ส่งผลลัพธ์สำเร็จ
```javascript
res.json({
  message: 'เข้าสู่ระบบสำเร็จ',
  user: {
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role
  }
});
```
- **ไม่ใช้ status(200):** เพราะ 200 เป็น default
- **user object:** ข้อมูลผู้ใช้ที่จำเป็น (ไม่รวมรหัสผ่าน)
- **ไม่ส่ง sensitive data:** เช่น password, _id

---

## 3. 🔄 changePassword.js - เปลี่ยนรหัสผ่าน

### 🎯 หน้าที่หลัก
เปลี่ยนรหัสผ่านของผู้ใช้โดยตรวจสอบรหัสเก่าก่อน

### 📥 Input Parameters
```javascript
const { username, oldPassword, newPassword } = req.body;
```

### 🔄 ขั้นตอนการทำงาน (ทีละบรรทัด)

#### 1. Input Validation - ตรวจสอบข้อมูลครบถ้วน
```javascript
if (!username) {
  return res.status(400).json({ error: 'กรุณาระบุชื่อผู้ใช้งาน' });
}    
if (!oldPassword) {
  return res.status(400).json({ error: 'กรุณาระบุรหัสผ่านเก่า' });
}
if (!newPassword) {
  return res.status(400).json({ error: 'กรุณาระบุรหัสผ่านใหม่' });
}
```
- **ตรวจสอบ 3 ฟิลด์บังคับ:** username, oldPassword, newPassword
- **security requirement:** ต้องรู้รหัสเก่าก่อนถึงจะเปลี่ยนได้

#### 2. User Lookup - ค้นหาผู้ใช้
```javascript
const user = await User.findOne({ username: username });
if (!user) {
  return res.status(400).json({ error: 'ไม่พบชื่อผู้ใช้งานนี้ในระบบ' });
}
```
- **findOne({ username }):** ค้นหาด้วย username เท่านั้น (ไม่รองรับ email)
- **security design:** ใช้ username เพื่อความชัดเจน

#### 3. Old Password Verification - ตรวจสอบรหัสเก่า
```javascript
const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
if (!isOldPasswordValid) {
  return res.status(400).json({ error: 'รหัสผ่านเก่าไม่ถูกต้อง' });
}
```
- **bcrypt.compare():** เปรียบเทียบรหัสเก่าที่ป้อนกับรหัสในฐานข้อมูล
- **security measure:** ป้องกันการเปลี่ยนรหัสโดยไม่ได้รับอนุญาต

#### 4. New Password Hashing - เข้ารหัสรหัสใหม่
```javascript
const saltRounds = 10;
const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
```
- **saltRounds = 10:** ใช้ค่าเดียวกับตอนสมัครสมาชิก
- **hash new password:** เข้ารหัสรหัสใหม่ก่อนบันทึก
#### 5. Database Update - อัปเดตฐานข้อมูล
```javascript
await User.findOneAndUpdate(
  { username: username },
  { password: hashedNewPassword },
  { new: true }
);
```

**การทำงานของ findOneAndUpdate() แบบละเอียด:**

**User.findOneAndUpdate():**
- **ประเภท:** Mongoose Model Method
- **การทำงาน:** ค้นหาและอัปเดตเอกสารในคำสั่งเดียว
- **return type:** Promise<Document | null>
- **MongoDB operation:** db.users.findOneAndUpdate(filter, update, options)

**Parameter 1 - Filter { username: username }:**
- **รูปแบบ:** MongoDB query filter
- **เงื่อนไข:** หาเอกสารที่มี field "username" เท่ากับค่าในตัวแปร username
- **exact match:** ต้องตรงกันทุกตัวอักษร
- **case sensitive:** แยกตัวพิมพ์เล็ก-ใหญ่
- **first match:** อัปเดตเฉพาะเอกสารแรกที่เจอ

**Parameter 2 - Update { password: hashedNewPassword }:**
- **รูปแบบ:** MongoDB update document
- **$set operation:** MongoDB จะทำ $set อัตโนมัติ
- **field update:** อัปเดตเฉพาะ field "password"
- **value:** ใช้ค่าจาก hashedNewPassword (รหัสที่เข้ารหัสแล้ว)
- **atomic:** การอัปเดตเป็น atomic operation

**Parameter 3 - Options { new: true }:**
- **new: true:** return เอกสารหลังการอัปเดต
- **new: false (default):** return เอกสารก่อนการอัปเดต
- **other options:**
  - `upsert: false` - ไม่สร้างเอกสารใหม่ถ้าไม่เจอ
  - `runValidators: true` - รัน schema validators
  - `setDefaultsOnInsert: true` - ใช้ default values เมื่อ upsert

**การทำงานภายใน:**
1. **Find operation:** ค้นหาเอกสารที่ตรงเงื่อนไข
2. **Update operation:** อัปเดต field ที่ระบุ
3. **Return document:** ส่งเอกสารกลับตาม options
4. **Validation:** ตรวจสอบ schema constraints

**ผลลัพธ์ที่เป็นไปได้:**
- **เจอและอัปเดตสำเร็จ:** return updated document
  ```javascript
  {
    _id: ObjectId("..."),
    username: "john123",
    password: "$2b$10$newHashedPassword...",
    email: "john@example.com",
    // ... other fields
    updatedAt: Date("2024-01-15T11:00:00.000Z")  // อัปเดตอัตโนมัติ
  }
  ```
- **ไม่เจอเอกสาร:** return null

**await keyword:**
- **asynchronous operation:** findOneAndUpdate() เป็น Promise-based
- **database operation:** ต้องส่งคำสั่งไป MongoDB server
- **blocking behavior:** รอการอัปเดตเสร็จก่อนไปบรรทัดถัดไป
- **error handling:** ถ้าอัปเดตล้มเหลว จะ throw error

**ข้อดีของ findOneAndUpdate:**
- **atomic operation:** ค้นหาและอัปเดตในคำสั่งเดียว
- **race condition safe:** ป้องกัน race conditions
- **efficient:** ลดจำนวน round trips ไป database
- **consistent:** ได้ข้อมูลที่สอดคล้องกัน

#### 6. Success Response
```javascript
res.json({
  message: 'เปลี่ยนรหัสผ่านเรียบร้อยแล้ว',
  username: username
});
```
- **confirmation message:** ยืนยันการเปลี่ยนรหัสผ่าน
- **return username:** เพื่อยืนยันว่าเปลี่ยนของใคร

---

## 4. 🚪 logout.js - ออกจากระบบ

### 🎯 หน้าที่หลัก
ลบสถานะการเข้าสู่ระบบของผู้ใช้

### 📥 Input Parameters
```javascript
const { username, email } = req.body;
```

### 🔄 ขั้นตอนการทำงาน (ทีละบรรทัด)

#### 1. Input Processing
```javascript
const { username, email } = req.body;
const usernameOrEmail = username || email;
if (!usernameOrEmail) {
  return res.status(400).json({ error: 'กรุณาระบุชื่อผู้ใช้งานหรืออีเมล' });
}
```
- **flexible input:** รับได้ทั้ง username หรือ email
- **เหมือน login:** ใช้ pattern เดียวกัน

#### 2. User Lookup
```javascript
const user = await User.findOne({
  $or: [
    { username: usernameOrEmail },
    { email: usernameOrEmail }
  ]
});
if (!user) {
  return res.status(400).json({ error: 'ไม่พบข้อมูลผู้ใช้งานในระบบ' });
}
```
- **$or query:** ค้นหาจาก username หรือ email
- **user validation:** ตรวจสอบว่าผู้ใช้มีอยู่จริง

#### 3. Login Status Check
```javascript
const loggedInUser = await LoggedInUser.findOne({ username: user.username });
if (!loggedInUser) {
  return res.status(400).json({ error: 'ผู้ใช้งานนี้ยังไม่ได้เข้าสู่ระบบ' });
}
```
- **check login status:** ดูว่าผู้ใช้ login อยู่หรือไม่
- **prevent double logout:** ป้องกันการ logout ซ้ำ

#### 4. Remove Login Status
```javascript
await LoggedInUser.deleteOne({ username: user.username });
```

**การทำงานของ deleteOne() แบบละเอียด:**

**LoggedInUser.deleteOne():**
- **ประเภท:** Mongoose Model Method
- **การทำงาน:** ลบเอกสาร (document) แรกที่ตรงกับเงื่อนไข
- **return type:** Promise<DeleteResult>
- **MongoDB operation:** db.loggedinusers.deleteOne({ username: "john123" })

**Query Filter { username: user.username }:**
- **รูปแบบ:** MongoDB delete filter
- **เงื่อนไข:** หาเอกสารที่มี field "username" เท่ากับค่าใน user.username
- **exact match:** ต้องตรงกันทุกตัวอักษร
- **case sensitive:** แยกตัวพิมพ์เล็ก-ใหญ่
- **single document:** ลบเฉพาะเอกสารแรกที่เจอ

**การทำงานภายใน:**
1. **Find matching document:** ค้นหาเอกสารที่ตรงเงื่อนไข
2. **Delete operation:** ลบเอกสารออกจาก collection
3. **Return result:** ส่งผลลัพธ์การลบกลับมา

**DeleteResult object:**
```javascript
{
  acknowledged: true,    // การดำเนินการได้รับการยืนยัน
  deletedCount: 1       // จำนวนเอกสารที่ถูกลบ (0 หรือ 1)
}
```

**ผลลัพธ์ที่เป็นไปได้:**
- **deletedCount: 1:** ลบสำเร็จ (เจอและลบได้)
- **deletedCount: 0:** ไม่มีการลบ (ไม่เจอเอกสารที่ตรงเงื่อนไข)

**await keyword:**
- **asynchronous operation:** deleteOne() เป็น Promise-based
- **database operation:** ต้องส่งคำสั่งไป MongoDB server
- **blocking behavior:** รอการลบเสร็จก่อนไปบรรทัดถัดไป
- **error handling:** ถ้าลบล้มเหลว จะ throw error

**ความปลอดภัย:**
- **atomic operation:** การลบเป็น atomic (สำเร็จหรือล้มเหลวทั้งหมด)
- **no cascade:** ไม่ลบข้อมูลที่เกี่ยวข้องอัตโนมัติ
- **clean logout:** ลบสถานะการเข้าสู่ระบบอย่างสะอาด

#### 5. Success Response
```javascript
res.json({
  message: 'ออกจากระบบเรียบร้อยแล้ว',
  username: user.username
});
```
- **confirmation:** ยืนยันการออกจากระบบ
- **username:** แสดงว่าใครออกจากระบบ
---

## 5. 🔑 forgotPassword.js - ลืมรหัสผ่าน (ระบบใหม่ - ปลอดภัย)

### 🎯 หน้าที่หลัก
รีเซ็ตรหัสผ่านด้วยระบบ Token แบบปลอดภัย (2 ฟังก์ชัน)

### 📋 ฟังก์ชันที่มี
1. **forgotPassword()** - ขอรีเซ็ตรหัสผ่าน (สร้าง token)
2. **resetPassword()** - ยืนยัน token และเปลี่ยนรหัสผ่าน

---

### 🔄 ฟังก์ชันที่ 1: forgotPassword() - ขอรีเซ็ต

#### 📥 Input Parameters
```javascript
const { email } = req.body;
```

#### ขั้นตอนการทำงาน

##### 1. Input Validation
```javascript
if (!email) {
  return res.status(400).json({ error: 'กรุณาระบุอีเมล' });
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  return res.status(400).json({ error: 'รูปแบบอีเมลไม่ถูกต้อง' });
}
```
- **email validation:** ตรวจสอบรูปแบบอีเมล
- **regex pattern:** ตรวจสอบพื้นฐาน

##### 2. User Lookup
```javascript
const user = await User.findOne({ email: email });
```
- **silent lookup:** ค้นหาแต่ไม่เปิดเผยผลลัพธ์

##### 3. Token Generation (ถ้าเจอผู้ใช้)
```javascript
if (user) {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiry = Date.now() + 3600000; // 1 ชั่วโมง
  
  await User.findOneAndUpdate(
    { email: email },
    { 
      resetToken: resetToken,
      resetTokenExpiry: resetTokenExpiry
    }
  );
}
```
- **crypto.randomBytes(32):** สร้าง token สุ่ม 32 bytes
- **toString('hex'):** แปลงเป็น hexadecimal string
- **resetTokenExpiry:** หมดอายุใน 1 ชั่วโมง (3,600,000 ms)

##### 4. Security Response
```javascript
res.json({
  message: 'หากอีเมลนี้มีในระบบ เราจะส่งลิงก์รีเซ็ตรหัสผ่านไปให้ภายใน 5 นาที'
});
```
- **same response always:** ไม่เปิดเผยว่าเจออีเมลหรือไม่
- **security by obscurity:** ป้องกัน email enumeration

---

### 🔄 ฟังก์ชันที่ 2: resetPassword() - ยืนยันและเปลี่ยน

#### 📥 Input Parameters
```javascript
const { token, newPassword } = req.body;
```

#### ขั้นตอนการทำงาน

##### 1. Input Validation
```javascript
if (!token) {
  return res.status(400).json({ error: 'กรุณาระบุ token' });
}
if (!newPassword) {
  return res.status(400).json({ error: 'กรุณาระบุรหัสผ่านใหม่' });
}
if (newPassword.length < 4) {
  return res.status(400).json({ error: 'รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร' });
}
```
- **token validation:** ตรวจสอบ token
- **password strength:** ตรวจสอบความยาวรหัสผ่าน

##### 2. Token Verification
```javascript
const user = await User.findOne({ 
  resetToken: token,
  resetTokenExpiry: { $gt: Date.now() } // token ยังไม่หมดอายุ
});

if (!user) {
  return res.status(400).json({ error: 'Token ไม่ถูกต้องหรือหมดอายุแล้ว' });
}
```
- **compound query:** ตรวจสอบทั้ง token และวันหมดอายุ
- **$gt operator:** greater than (มากกว่าเวลาปัจจุบัน)
- **atomic check:** ตรวจสอบในคำสั่งเดียว

##### 3. Password Update and Token Cleanup
```javascript
const saltRounds = 10;
const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

await User.findOneAndUpdate(
  { _id: user._id },
  { 
    password: hashedNewPassword,
    resetToken: undefined,      // ลบ token
    resetTokenExpiry: undefined // ลบวันหมดอายุ
  }
);
```
- **password hashing:** เข้ารหัสรหัสผ่านใหม่
- **token cleanup:** ลบ token หลังใช้งาน (one-time use)
- **undefined assignment:** ลบฟิลด์ออกจาก document

##### 4. Success Response
```javascript
res.json({
  message: 'เปลี่ยนรหัสผ่านเรียบร้อยแล้ว',
  username: user.username
});
```
- **confirmation:** ยืนยันการเปลี่ยนรหัสผ่าน
- **username return:** แสดงว่าเปลี่ยนของใคร

### 🛡️ ความปลอดภัยของระบบใหม่
- **Two-step process:** แยกการขอและการยืนยัน
- **Token expiry:** หมดอายุใน 1 ชั่วโมง
- **One-time use:** ใช้ได้ครั้งเดียว
- **No information disclosure:** ไม่เปิดเผยข้อมูลผู้ใช้
- **Cryptographically secure:** ใช้ crypto.randomBytes()

---

## 6. 👥 getUsers.js - ดูข้อมูลผู้ใช้

### 🎯 หน้าที่หลัก
ดึงข้อมูลผู้ใช้ทั้งหมดหรือตามบทบาท

### 📋 ฟังก์ชันที่มี
1. **getAllUsers()** - ดึงผู้ใช้ทั้งหมด
2. **getUsersByRole()** - ดึงผู้ใช้ตามบทบาท

### 🔄 getAllUsers() - ดึงผู้ใช้ทั้งหมด

#### 1. Simple Query
```javascript
const users = await User.find({});
```

**การทำงานของ User.find() แบบละเอียด:**

**User.find():**
- **ประเภท:** Mongoose Model Method
- **การทำงาน:** ค้นหาเอกสารทั้งหมดที่ตรงกับเงื่อนไข
- **return type:** Promise<Document[]>
- **MongoDB operation:** db.users.find({})

**Query Filter {}:**
- **empty object:** ไม่มีเงื่อนไขการกรอง
- **match all:** ดึงเอกสารทั้งหมดใน collection
- **equivalent to:** SELECT * FROM users (ใน SQL)

**การทำงานภายใน:**
1. **Query execution:** ส่งคำสั่ง find ไป MongoDB
2. **Cursor creation:** MongoDB สร้าง cursor สำหรับผลลัพธ์
3. **Document retrieval:** ดึงเอกสารทั้งหมดมาเป็น array
4. **Memory loading:** โหลดข้อมูลทั้งหมดเข้า memory

**ผลลัพธ์ที่ได้:**
```javascript
users = [
  {
    _id: ObjectId("..."),
    username: "user1",
    email: "user1@example.com",
    firstName: "John",
    lastName: "Doe",
    role: "user",
    createdAt: Date,
    updatedAt: Date
  },
  {
    _id: ObjectId("..."),
    username: "user2", 
    email: "user2@example.com",
    firstName: "Jane",
    lastName: "Smith",
    role: "admin",
    createdAt: Date,
    updatedAt: Date
  },
  // ... more users
]
```

**Performance Considerations:**
- **memory usage:** โหลดข้อมูลทั้งหมดเข้า memory
- **network traffic:** ส่งข้อมูลทั้งหมดผ่าน network
- **large datasets:** อาจช้าถ้ามีข้อมูลเยอะ
- **pagination:** ควรใช้ limit() และ skip() สำหรับข้อมูลเยอะ

**await keyword:**
- **asynchronous operation:** find() เป็น Promise-based
- **database operation:** ต้องส่งคำสั่งไป MongoDB server
- **blocking behavior:** รอการค้นหาเสร็จก่อนไปบรรทัดถัดไป
- **error handling:** ถ้าค้นหาล้มเหลว จะ throw error

**Alternative approaches สำหรับข้อมูลเยอะ:**
```javascript
// ใช้ pagination
const users = await User.find({}).limit(10).skip(0);

// ใช้ cursor สำหรับข้อมูลใหญ่
const cursor = User.find({}).cursor();
for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
  // process each document
}

// เลือกเฉพาะ fields ที่ต้องการ
const users = await User.find({}, 'username email firstName lastName');
```

#### 2. Response with Count
```javascript
res.json({
  message: 'ดึงข้อมูลผู้ใช้งานทั้งหมดสำเร็จ',
  users: users,
  total: users.length
});
```
- **users array:** ข้อมูลผู้ใช้ทั้งหมด
- **total count:** จำนวนผู้ใช้ทั้งหมด
### 🔄 getUsersByRole() - ดึงผู้ใช้ตามบทบาท

#### 1. Extract Role Parameter
```javascript
const role = req.params.role;
```
- **req.params.role:** ดึง role จาก URL path (เช่น /api/users/admin)
- **URL parameter:** ส่วนที่อยู่หลัง /api/users/

#### 2. Role-based Query
```javascript
const users = await User.find({ role: role });
```

**การทำงานของ User.find({ role: role }) แบบละเอียด:**

**Filtered Query:**
- **query filter:** { role: role }
- **field matching:** หาเอกสารที่มี field "role" เท่ากับค่าในตัวแปร role
- **exact match:** ต้องตรงกันทุกตัวอักษร
- **case sensitive:** แยกตัวพิมพ์เล็ก-ใหญ่

**ตัวอย่างการทำงาน:**
```javascript
// ถ้า role = "admin"
const users = await User.find({ role: "admin" });
// MongoDB query: db.users.find({ role: "admin" })

// ถ้า role = "user"  
const users = await User.find({ role: "user" });
// MongoDB query: db.users.find({ role: "user" })

// ถ้า role = "manager"
const users = await User.find({ role: "manager" });
// MongoDB query: db.users.find({ role: "manager" })
```

**ผลลัพธ์ที่เป็นไปได้:**
1. **เจอผู้ใช้ในบทบาทนั้น:**
   ```javascript
   users = [
     {
       _id: ObjectId("..."),
       username: "admin1",
       email: "admin1@example.com", 
       role: "admin",
       // ... other fields
     },
     {
       _id: ObjectId("..."),
       username: "admin2",
       email: "admin2@example.com",
       role: "admin", 
       // ... other fields
     }
   ]
   ```

2. **ไม่เจอผู้ใช้ในบทบาทนั้น:**
   ```javascript
   users = []  // empty array
   ```

**Performance Optimization:**
- **index usage:** ถ้ามี index บน role field จะค้นหาเร็วขึ้น
- **selective query:** ค้นหาเฉพาะข้อมูลที่ต้องการ
- **memory efficient:** ใช้ memory น้อยกว่าการดึงทั้งหมด

**Database Index Recommendation:**
```javascript
// สร้าง index บน role field เพื่อเพิ่มประสิทธิภาพ
db.users.createIndex({ role: 1 })
```

**Query Performance:**
- **with index:** O(log n) + O(k) where k = number of matching documents
- **without index:** O(n) where n = total documents in collection
- **memory usage:** proportional to number of matching documents

#### 3. Conditional Response
```javascript
if (users.length > 0) {
  res.json({
    message: `ดึงข้อมูลผู้ใช้งานกลุ่ม ${role} สำเร็จ`,
    users: users,
    total: users.length
  });
} else {
  res.status(404).json({ error: 'ไม่พบผู้ใช้งานในบทบาทนี้' });
}
```
- **length check:** ตรวจสอบว่ามีผลลัพธ์หรือไม่
- **dynamic message:** แสดง role ในข้อความ
- **404 for empty:** ส่ง Not Found ถ้าไม่มีผู้ใช้ในบทบาทนั้น

---

## 7. 🗑️ deleteUser.js - ลบผู้ใช้งาน

### 🎯 หน้าที่หลัก
ลบผู้ใช้งานและสถานะการเข้าสู่ระบบ

### 📥 Input Parameters
```javascript
const id = req.params.id;
```

### 🔄 ขั้นตอนการทำงาน (ทีละบรรทัด)

#### 1. ID Validation
```javascript
const id = req.params.id;
if (!id) {
  return res.status(400).json({ error: 'กรุณาระบุ ID' });
}
```
- **URL parameter:** ดึง ID จาก URL path
- **validation:** ตรวจสอบว่ามี ID หรือไม่

#### 2. User Lookup and Deletion
```javascript
const user = await User.findOne({ id: id });
if (user) {
  await LoggedInUser.deleteOne({ username: user.username });
  await User.findOneAndDelete({ id: id });
}
```

**การทำงานของ findOneAndDelete() แบบละเอียด:**

**User.findOneAndDelete():**
- **ประเภท:** Mongoose Model Method
- **การทำงาน:** ค้นหาและลบเอกสารในคำสั่งเดียว
- **return type:** Promise<Document | null>
- **MongoDB operation:** db.users.findOneAndDelete({ id: id })

**Query Filter { id: id }:**
- **รูปแบบ:** MongoDB query filter
- **เงื่อนไข:** หาเอกสารที่มี field "id" เท่ากับค่าในตัวแปร id
- **exact match:** ต้องตรงกันทุกตัวอักษร
- **first match:** ลบเฉพาะเอกสารแรกที่เจอ

**การทำงานภายใน:**
1. **Find operation:** ค้นหาเอกสารที่ตรงเงื่อนไข
2. **Return document:** เก็บเอกสารที่จะลบไว้
3. **Delete operation:** ลบเอกสารออกจาก collection
4. **Return result:** ส่งเอกสารที่ลบแล้วกลับมา

**ผลลัพธ์ที่เป็นไปได้:**
- **เจอและลบสำเร็จ:** return deleted document
  ```javascript
  {
    _id: ObjectId("..."),
    id: "user123",
    username: "john123",
    password: "$2b$10$...",
    email: "john@example.com",
    // ... other fields
  }
  ```
- **ไม่เจอเอกสาร:** return null

**Cascading Delete Pattern:**
```javascript
// ขั้นตอนที่ 1: ค้นหาผู้ใช้ก่อน
const user = await User.findOne({ id: id });

if (user) {
  // ขั้นตอนที่ 2: ลบข้อมูลที่เกี่ยวข้องก่อน
  await LoggedInUser.deleteOne({ username: user.username });
  
  // ขั้นตอนที่ 3: ลบผู้ใช้หลัก
  await User.findOneAndDelete({ id: id });
}
```

**เหตุผลของ Cascading Delete:**
- **data integrity:** ป้องกันข้อมูลกำพร้า (orphaned data)
- **clean deletion:** ลบข้อมูลที่เกี่ยวข้องทั้งหมด
- **referential consistency:** รักษาความสอดคล้องของข้อมูล
- **prevent errors:** ป้องกัน foreign key constraints errors

**ข้อดีของ findOneAndDelete:**
- **atomic operation:** ค้นหาและลบในคำสั่งเดียว
- **return deleted data:** ได้ข้อมูลที่ลบแล้วกลับมา
- **efficient:** ลดจำนวน database operations
- **safe deletion:** ป้องกันการลบผิดเอกสาร

**await keyword:**
- **asynchronous operation:** findOneAndDelete() เป็น Promise-based
- **database operation:** ต้องส่งคำสั่งไป MongoDB server
- **blocking behavior:** รอการลบเสร็จก่อนไปบรรทัดถัดไป
- **error handling:** ถ้าลบล้มเหลว จะ throw error

#### 3. User Not Found Check
```javascript
if (!user) {
  return res.status(404).json({ error: 'ไม่พบผู้ใช้งานที่ต้องการลบ' });
}
```
- **after deletion check:** ตรวจสอบหลังจากพยายามลบ
- **404 response:** ส่ง Not Found ถ้าไม่เจอผู้ใช้

#### 4. Success Response
```javascript
res.json({ 
  message: 'ลบผู้ใช้งานเรียบร้อยแล้ว',
  deletedUser: user.username
});
```
- **confirmation:** ยืนยันการลบ
- **deleted username:** แสดงว่าลบใครไป

---

# 👥 Person Management APIs

## 8. 📋 getAllPersons.js - ดูข้อมูลบุคคลทั้งหมด

### 🎯 หน้าที่หลัก
ดึงข้อมูลบุคคลทั้งหมดจากฐานข้อมูล

### 🔄 ขั้นตอนการทำงาน (ทีละบรรทัด)

#### 1. Promise-based Query
```javascript
Person.find({})
  .then(function(persons) {
    // success handler
  })
  .catch(function(error) {
    // error handler
  });
```
- **Promise pattern:** ใช้ .then() และ .catch() แทน async/await
- **Person.find({}):** ดึงข้อมูลบุคคลทั้งหมด
#### 2. Success Handler
```javascript
.then(function(persons) {
  res.json({
    message: 'ดึงข้อมูลบุคคลทั้งหมดสำเร็จ',
    persons: persons,
    total: persons.length
  });
})
```
- **persons array:** ข้อมูลบุคคลทั้งหมดที่ดึงมา
- **total count:** จำนวนบุคคลทั้งหมด
- **simple response:** ไม่มีการประมวลผลซับซ้อน

#### 3. Error Handler
```javascript
.catch(function(error) {
  console.error('เกิดข้อผิดพลาดในการดึงข้อมูลบุคคล:', error);
  res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
});
```
- **error logging:** บันทึก error ใน console
- **generic error message:** ไม่เปิดเผยรายละเอียด error

---

## 9. 🔍 getPersonById.js - ดูข้อมูลบุคคลตาม ID

### 🎯 หน้าที่หลัก
ดึงข้อมูลบุคคลคนเดียวตาม ID

### 🔄 ขั้นตอนการทำงาน (ทีละบรรทัด)

#### 1. Middleware Chain
```javascript
function getPersonById(req, res) {
  checkDatabaseConnection(req, res, () => {
    processGetPersonById(req, res);
  });
}
```
- **middleware pattern:** ใช้ callback chain
- **checkDatabaseConnection:** ตรวจสอบ DB ก่อน
- **callback function:** ส่งต่อไป processGetPersonById

#### 2. Main Processing Function
```javascript
async function processGetPersonById(req, res) {
  try {
    const id = req.params.id;
    const person = await Person.findOne({ id: id });
```
- **separate function:** แยกการประมวลผลหลัก
- **async/await:** ใช้ modern JavaScript pattern
- **URL parameter:** ดึง ID จาก URL

#### 3. Person Lookup
```javascript
const person = await Person.findOne({ id: id });
if (!person) {
  return res.status(404).json({ error: 'ไม่พบข้อมูลบุคคล' });
}
```
- **findOne query:** ค้นหาบุคคลด้วย ID
- **null check:** ตรวจสอบว่าเจอหรือไม่
- **404 response:** ส่ง Not Found ถ้าไม่เจอ

#### 4. Success Response
```javascript
res.json({
  message: 'ดึงข้อมูลบุคคลสำเร็จ',
  person: person
});
```
- **single person object:** ส่งข้อมูลบุคคลคนเดียว
- **complete data:** ส่งข้อมูลครบถ้วนทั้งหมด

---

## 10. ➕ createPerson.js - เพิ่มข้อมูลบุคคล

### 🎯 หน้าที่หลัก
สร้างข้อมูลบุคคลใหม่พร้อมรูปภาพ (บังคับ)

### 🔄 Middleware Chain
```javascript
function createPerson(req, res) {
  handleFileUpload(req, res, () => {
    validatePersonData(req, res, () => {
      processCreatePerson(req, res);
    });
  });
}
```
- **3-layer middleware:**
  1. handleFileUpload - จัดการรูปภาพ
  2. validatePersonData - ตรวจสอบข้อมูล
  3. processCreatePerson - ประมวลผลหลัก

### 🔄 ขั้นตอนการทำงาน (ทีละบรรทัด)

#### 1. Image Requirement Check
```javascript
if (!req.uploadedImage && !req.body.image) {
  return res.status(400).json({ 
    error: 'กรุณาอัปโหลดรูปภาพ (ขนาดไม่เกิน 70KB, รองรับ jpg, jpeg, png, gif)' 
  });
}
```
- **mandatory image:** บังคับต้องมีรูปภาพ
- **two sources:** ตรวจสอบทั้ง uploaded file และ body data
- **detailed error:** บอกข้อกำหนดรูปภาพ
#### 2. Image Path Processing
```javascript
let imagePath = '';
if (req.uploadedImage) {
  imagePath = req.uploadedImage;
}
```
- **image path extraction:** ดึงชื่อไฟล์รูปที่อัปโหลด
- **middleware result:** ได้จาก handleFileUpload middleware

#### 3. Number Validation Helper
```javascript
function parseNumber(value, defaultValue = null) {
  if (!value || value === '' || value === '-' || value === 'null' || value === 'undefined') {
    return defaultValue;
  }
  if (typeof value === 'string' && value.trim() === '') {
    return defaultValue;
  }
  const parsed = parseInt(value);
  if (isNaN(parsed) || parsed < 0) {
    return defaultValue;
  }
  return parsed;
}
```
- **robust parsing:** จัดการ edge cases ต่างๆ
- **null/undefined handling:** จัดการค่าว่าง
- **negative number check:** ป้องกันตัวเลขติดลบ
- **default value:** ใช้ค่า default ถ้าไม่ valid

#### 4. Special Field Validation
```javascript
if (req.body.numberOfChildren !== undefined && req.body.numberOfChildren !== '') {
  const numChildren = parseNumber(req.body.numberOfChildren, null);
  if (numChildren === null) {
    return res.status(400).json({ 
      error: 'จำนวนลูกต้องเป็นตัวเลขเท่านั้น (หรือไม่ต้องใส่ก็ได้)',
      receivedValue: req.body.numberOfChildren
    });
  }
}
```
- **specific validation:** ตรวจสอบฟิลด์พิเศษ
- **optional field:** ไม่บังคับแต่ถ้ามีต้องถูกต้อง
- **error with context:** แสดงค่าที่ได้รับมาด้วย

#### 5. Person Data Object Creation
```javascript
const personData = {
  ...(req.body.id && { id: req.body.id }),
  thaiTitle: req.body.thaiTitle || '',
  firstName: req.body.firstName,
  lastName: req.body.lastName,
  // ... 100+ fields
  image: imagePath || req.body.image || ''
};
```
- **conditional spread:** ใส่ id เฉพาะเมื่อมี
- **default values:** ใช้ empty string เป็น default
- **required fields:** firstName, lastName ไม่มี default
- **comprehensive data:** รองรับข้อมูล 100+ ฟิลด์

#### 6. Database Save
```javascript
const person = new Person(personData);
person.save()
  .then(function(newPerson) {
    res.status(201).json({
      message: 'สร้างข้อมูลเรียบร้อยแล้ว',
      person: newPerson
    });
  })
```
- **new Person():** สร้าง instance ใหม่
- **Promise pattern:** ใช้ .then() สำหรับ success
- **201 status:** Created status code
- **return complete data:** ส่งข้อมูลที่สร้างแล้วกลับ

---

## 11. ✏️ updatePerson.js - แก้ไขข้อมูลบุคคล

### 🎯 หน้าที่หลัก
อัปเดตข้อมูลบุคคลที่มีอยู่ (รองรับการเปลี่ยนรูปภาพ)

### 🔄 Middleware Chain
```javascript
function updatePerson(req, res) {
  handleFileUpload(req, res, () => {
    checkDuplicateId(Person)(req, res, () => {
      processUpdatePerson(req, res);
    });
  });
}
```
- **2-layer middleware:**
  1. handleFileUpload - จัดการรูปใหม่ (ถ้ามี)
  2. checkDuplicateId - ตรวจสอบ ID ซ้ำ

### 🔄 ขั้นตอนการทำงาน (ทีละบรรทัด)

#### 1. ID Validation
```javascript
const id = req.params.id;
if (!id) {
  return res.status(400).json({ error: 'กรุณาระบุ ID' });
}
```
- **URL parameter:** ดึง ID จาก URL path
- **mandatory check:** ID เป็นข้อมูลบังคับ

#### 2. Update Data Preparation
```javascript
const updateData = { ...req.body };
delete updateData._id;
delete updateData.__v;
```
- **spread operator:** copy ข้อมูลทั้งหมดจาก req.body
- **cleanup:** ลบฟิลด์ที่ไม่ควรอัปเดต (_id, __v)
- **MongoDB fields:** _id และ __v เป็นฟิลด์ internal ของ MongoDB
#### 3. Image Update Handling
```javascript
if (req.uploadedImage) {
  updateData.image = req.uploadedImage;
}
if (!updateData.id) {
  updateData.id = id;
}
```
- **conditional image update:** อัปเดตรูปเฉพาะเมื่อมีการอัปโหลดใหม่
- **ID preservation:** ใส่ ID กลับไปถ้าไม่มีใน updateData

#### 4. Database Update
```javascript
const updatedPerson = await Person.findOneAndUpdate(
  { id: id }, 
  updateData, 
  { new: true }
);
```
- **findOneAndUpdate:** ค้นหาและอัปเดตในคำสั่งเดียว
- **{ id: id }:** เงื่อนไขการค้นหา
- **updateData:** ข้อมูลที่จะอัปเดต
- **{ new: true }:** return ข้อมูลหลังอัปเดตแล้ว

#### 5. Update Result Check
```javascript
if (!updatedPerson) {
  return res.status(404).json({ error: 'ไม่พบข้อมูลที่ต้องการแก้ไข' });
}
```
- **null check:** ตรวจสอบว่าอัปเดตสำเร็จหรือไม่
- **404 response:** ส่ง Not Found ถ้าไม่เจอข้อมูล

#### 6. Success Response
```javascript
res.json({
  message: 'แก้ไขข้อมูลเรียบร้อยแล้ว',
  person: updatedPerson
});
```
- **updated data:** ส่งข้อมูลที่อัปเดตแล้วกลับ
- **complete object:** ข้อมูลครบถ้วนหลังการอัปเดต

---

## 12. 🗑️ deletePerson.js - ลบข้อมูลบุคคล

### 🎯 หน้าที่หลัก
ลบข้อมูลบุคคลออกจากระบบ

### 🔄 Middleware Chain
```javascript
function deletePerson(req, res) {
  checkDatabaseConnection(req, res, () => {
    processDeletePerson(req, res);
  });
}
```
- **1-layer middleware:** checkDatabaseConnection เท่านั้น
- **simple chain:** ไม่ซับซ้อนเหมือน create/update

### 🔄 ขั้นตอนการทำงาน (ทีละบรรทัด)

#### 1. ID Extraction
```javascript
const id = req.params.id
```
- **URL parameter:** ดึง ID จาก URL path
- **no validation:** ไม่มีการตรวจสอบ (อาจเป็น bug)

#### 2. Find and Delete Pattern
```javascript
const person = await Person.findOne({ id: id });
if (person) {
  await Person.findOneAndDelete({ id: id });
}
```
- **find first:** ค้นหาก่อนลบ
- **conditional delete:** ลบเฉพาะเมื่อเจอ
- **two-step process:** แยกการค้นหาและการลบ

#### 3. Deletion Result Check
```javascript
if (!person) {
  return res.status(404).json({ error: 'ไม่พบข้อมูลที่ต้องการลบ' });
}
```
- **after deletion check:** ตรวจสอบหลังจากพยายามลบ
- **404 response:** ส่ง Not Found ถ้าไม่เจอ

#### 4. Success Response
```javascript
res.json({ 
  message: 'ลบข้อมูลเรียบร้อยแล้ว',
  deletedId: id
});
```
- **confirmation:** ยืนยันการลบ
- **deleted ID:** แสดง ID ที่ถูกลบ

---

# 🔧 Middleware Functions

## 13. 📤 handleFileUpload (middleware/upload.js)

### 🎯 หน้าที่หลัก
จัดการการอัปโหลดไฟล์รูปภาพอย่างปลอดภัย

### 🔄 ขั้นตอนการทำงาน (ทีละบรรทัด)

#### 1. Content-Type Check
```javascript
const contentType = req.headers['content-type'] || '';
if (contentType.includes('multipart/form-data')) {
  // process file upload
}
```
- **header inspection:** ตรวจสอบ Content-Type header
- **multipart detection:** ดูว่าเป็น form-data หรือไม่
- **conditional processing:** ประมวลผลเฉพาะเมื่อมีไฟล์

#### 2. Multer Configuration
```javascript
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    const uniqueName = 'image-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
```
- **disk storage:** เก็บไฟล์ในระบบไฟล์
- **destination:** โฟลเดอร์ uploads/
- **unique filename:** timestamp + random number + extension
- **collision prevention:** ป้องกันชื่อไฟล์ซ้ำ
#### 3. File Validation
```javascript
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 70 * 1024 // 70KB in bytes
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('รองรับเฉพาะไฟล์รูปภาพ (jpg, jpeg, png, gif) เท่านั้น'));
    }
  }
});
```
- **size limit:** ไม่เกิน 70KB (71,680 bytes)
- **file type validation:** ตรวจสอบทั้ง extension และ MIME type
- **double check:** ป้องกันการ bypass ด้วยการเปลี่ยนชื่อไฟล์
- **error callback:** ส่ง error ถ้าไฟล์ไม่ valid

#### 4. Upload Processing
```javascript
return upload.any()(req, res, function (err) {
  if (err) {
    // handle different error types
  }
  if (req.files && req.files.length > 0) {
    req.uploadedImage = req.files[0].filename;
  }
  next();
});
```
- **upload.any():** รับไฟล์จากฟิลด์ใดก็ได้
- **error handling:** จัดการ error ต่างๆ
- **file result:** เก็บชื่อไฟล์ใน req.uploadedImage
- **middleware chain:** เรียก next() เพื่อส่งต่อ

#### 5. Error Classification
```javascript
if (err.code === 'LIMIT_FILE_SIZE') {
  return res.status(400).json({ 
    error: 'ขนาดไฟล์รูปภาพต้องไม่เกิน 70KB' 
  });
}
if (err.message.includes('รองรับเฉพาะไฟล์รูปภาพ')) {
  return res.status(400).json({ 
    error: err.message 
  });
}
```
- **specific error handling:** แยกประเภท error
- **user-friendly messages:** ข้อความที่เข้าใจง่าย
- **error code checking:** ใช้ error.code เพื่อระบุปัญหา

---

## 14. ✅ validatePersonData (middleware/validation.js)

### 🎯 หน้าที่หลัก
ตรวจสอบความถูกต้องของข้อมูลบุคคล

### 🔄 ขั้นตอนการทำงาน (ทีละบรรทัด)

#### 1. Required Fields Check
```javascript
if (!req.body.firstName) {
  return res.status(400).json({ error: 'กรุณาระบุชื่อ' });
}
if (!req.body.lastName) {
  return res.status(400).json({ error: 'กรุณาระบุนามสกุล' });
}
if (!req.body.email) {
  return res.status(400).json({ error: 'กรุณาระบุอีเมล' });
}
```
- **mandatory fields:** ตรวจสอบฟิลด์บังคับ
- **early return:** หยุดทันทีเมื่อเจอข้อผิดพลาด
- **specific messages:** ข้อความแจ้งเตือนชัดเจน

#### 2. Email Format Validation
```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(req.body.email)) {
  return res.status(400).json({ error: 'รูปแบบอีเมลไม่ถูกต้อง' });
}
```
- **regex pattern:** ตรวจสอบรูปแบบอีเมล
- **basic validation:** ตรวจสอบพื้นฐาน (มี @ และ .)
- **format check:** ไม่ตรวจสอบว่าอีเมลมีจริงหรือไม่

#### 3. Data Length Validation
```javascript
if (req.body.firstName.length > 50) {
  return res.status(400).json({ error: 'ชื่อต้องไม่เกิน 50 ตัวอักษร' });
}
```
- **length limits:** จำกัดความยาวข้อมูล
- **database constraints:** ป้องกันข้อมูลเกินขนาดที่กำหนด

---

## 15. 🔗 checkDatabaseConnection (middleware/database.js)

### 🎯 หน้าที่หลัก
ตรวจสอบการเชื่อมต่อฐานข้อมูลก่อนประมวลผล

### 🔄 ขั้นตอนการทำงาน (ทีละบรรทัด)

#### 1. Connection State Check
```javascript
const mongoose = require('mongoose');
if (mongoose.connection.readyState !== 1) {
  return res.status(500).json({ error: 'ไม่ได้เชื่อมต่อฐานข้อมูล' });
}
```
- **readyState check:** ตรวจสอบสถานะการเชื่อมต่อ
- **state 1:** หมายถึง connected
- **early exit:** หยุดการทำงานถ้า DB ไม่พร้อม

#### 2. Continue Processing
```javascript
next(); // เรียกฟังก์ชันถัดไป
```
- **middleware chain:** ส่งต่อไปยังฟังก์ชันถัดไป
- **simple pass-through:** ไม่มีการประมวลผลเพิ่มเติม

---

# 📊 สรุปการทำงานของระบบ

## 🔄 Flow การทำงานทั่วไป
1. **Request เข้ามา** → Express Router
2. **Middleware Chain** → ตรวจสอบและประมวลผล
3. **Main Function** → ประมวลผลหลัก
4. **Database Operation** → บันทึก/ดึงข้อมูล
5. **Response** → ส่งผลลัพธ์กลับ

## 🛡️ Security Measures
- **Password Hashing:** bcrypt กับ salt rounds = 10
- **File Validation:** ขนาดและประเภทไฟล์
- **Input Validation:** ตรวจสอบข้อมูลก่อนบันทึก
- **Error Handling:** ไม่เปิดเผยข้อมูลสำคัญ

## 📈 Performance Considerations
- **Database Indexing:** ใช้ unique indexes
- **File Size Limits:** จำกัดขนาดไฟล์
- **Error Logging:** บันทึก error สำหรับ debug
- **Middleware Chain:** ประมวลผลเป็นขั้นตอน

---

**ระบบนี้ออกแบบมาให้มีความปลอดภัยสูง รองรับการใช้งานจริง และง่ายต่อการบำรุงรักษา**

---

## 🔐 Simple Identity Verification System - ระบบยืนยันตัวตนแบบง่าย (อัปเดตแล้ว)

### 📄 routes/auth/forgotPassword.js - ระบบใหม่ที่เรียบง่าย

#### 🎯 หน้าที่หลัก
รีเซ็ตรหัสผ่านด้วยการยืนยันตัวตน (username + email + phone) ในขั้นตอนเดียว

#### 🧹 การปรับปรุงล่าสุด
- ลดความซับซ้อนจาก 3 ขั้นตอนเหลือ 1 ขั้นตอน
- ใช้การยืนยันตัวตนแบบง่าย (username + email + phone)
- เข้ารหัสรหัสผ่านด้วย bcrypt เพื่อความปลอดภัย
- ไม่ใช้ token หรือ session ซับซ้อน

#### 📥 Input Parameters

**forgotPassword():**
```javascript
const { username } = req.body;
```

**verifySecurityAnswers():**
```javascript
const { sessionToken, answers } = req.body;
```

**resetPassword():**
```javascript
const { token, newPassword } = req.body;
```

#### 🔄 ขั้นตอนการทำงาน (ทีละบรรทัด)

### 1. 🔑 forgotPassword() - สร้างคำถามความปลอดภัย

#### 1.1 รับข้อมูล Username
```javascript
const { username } = req.body;
if (!username) {
  return res.status(400).json({ error: 'กรุณาระบุ username' });
}
```
**อธิบาย:**
- ใช้ username แทน email เพื่อไม่ต้องเช็คอีเมล
- ตรวจสอบว่ามี username หรือไม่

#### 1.2 ค้นหาผู้ใช้
```javascript
const user = await User.findOne({ username: username });
if (!user) {
  return res.status(404).json({ error: 'ไม่พบผู้ใช้นี้ในระบบ' });
}
```
**อธิบาย:**
- ค้นหาผู้ใช้ด้วย username
- ถ้าไม่เจอจะบอกตรงๆ (ไม่ซ่อนเหมือนระบบอีเมล)

#### 1.3 สร้างคำถามความปลอดภัย
```javascript
const securityQuestions = [
  {
    id: 1,
    question: `อีเมลของคุณขึ้นต้นด้วยอักษรอะไร?`,
    answer: user.email.charAt(0).toLowerCase(),
    hint: `ตัวอักษรแรกของอีเมล ${user.email.charAt(0)}***`
  },
  {
    id: 2,
    question: `นามสกุลของคุณมีกี่ตัวอักษร?`,
    answer: user.lastName.length.toString(),
    hint: `นามสกุล: ${user.lastName.charAt(0)}***`
  },
  {
    id: 3,
    question: `ชื่อของคุณขึ้นต้นและลงท้ายด้วยอักษรอะไร?`,
    answer: (user.firstName.charAt(0) + user.firstName.charAt(user.firstName.length - 1)).toLowerCase(),
    hint: `ชื่อ: ${user.firstName.charAt(0)}***${user.firstName.charAt(user.firstName.length - 1)}`
  }
];
```

**การทำงานของการสร้างคำถาม:**

**คำถามที่ 1: อีเมลขึ้นต้นด้วยอักษรอะไร?**
- `user.email.charAt(0)` = ดึงตัวอักษรแรกของอีเมล
- `.toLowerCase()` = แปลงเป็นตัวพิมพ์เล็ก
- ตัวอย่าง: "john@example.com" → คำตอบ: "j"

**คำถามที่ 2: นามสกุลมีกี่ตัวอักษร?**
- `user.lastName.length` = นับจำนวนตัวอักษรในนามสกุล
- `.toString()` = แปลงตัวเลขเป็น string
- ตัวอย่าง: "Doe" → คำตอบ: "3"

**คำถามที่ 3: ชื่อขึ้นต้นและลงท้ายด้วยอักษรอะไร?**
- `user.firstName.charAt(0)` = ตัวอักษรแรกของชื่อ
- `user.firstName.charAt(user.firstName.length - 1)` = ตัวอักษรสุดท้าย
- รวมกันและแปลงเป็นตัวพิมพ์เล็ก
- ตัวอย่าง: "John" → คำตอบ: "jn"

#### 1.4 สุ่มเลือกคำถาม
```javascript
const selectedQuestions = securityQuestions
  .sort(() => 0.5 - Math.random())
  .slice(0, 2)
  .map(q => ({
    id: q.id,
    question: q.question,
    hint: q.hint
  }));
```

**การทำงานของการสุ่ม:**
- `.sort(() => 0.5 - Math.random())` = สุ่มเรียงลำดับ array
- `Math.random()` = สร้างตัวเลขสุ่ม 0-1
- `0.5 - Math.random()` = ได้ค่าระหว่าง -0.5 ถึง 0.5
- `.slice(0, 2)` = เลือก 2 ตัวแรก
- `.map()` = แปลงให้เหลือเฉพาะข้อมูลที่ต้องการ (ไม่รวมคำตอบ)

#### 1.5 สร้าง Session Token
```javascript
const sessionToken = crypto.randomBytes(16).toString('hex');
const sessionExpiry = Date.now() + 600000; // 10 นาที
```

**การทำงานของ crypto.randomBytes():**
- `crypto.randomBytes(16)` = สร้าง random bytes 16 ตัว
- `.toString('hex')` = แปลงเป็น hexadecimal string
- ได้ string ยาว 32 ตัวอักษร (16 bytes × 2)
- `Date.now() + 600000` = เวลาปัจจุบัน + 10 นาที (600,000 มิลลิวินาที)

#### 1.6 บันทึก Session และคำตอบ
```javascript
await User.findOneAndUpdate(
  { username: username },
  { 
    resetToken: sessionToken,
    resetTokenExpiry: sessionExpiry,
    tempSecurityAnswers: JSON.stringify(securityQuestions.map(q => ({ id: q.id, answer: q.answer })))
  }
);
```

**การทำงานของการบันทึก:**
- `resetToken` = เก็บ session token
- `resetTokenExpiry` = เก็บเวลาหมดอายุ
- `tempSecurityAnswers` = เก็บคำตอบทั้งหมดเป็น JSON string
- `JSON.stringify()` = แปลง JavaScript object เป็น JSON string
- `.map(q => ({ id: q.id, answer: q.answer }))` = เลือกเฉพาะ id และ answer

### 2. 🔍 verifySecurityAnswers() - ตรวจสอบคำตอบ

#### 2.1 รับข้อมูลและตรวจสอบ
```javascript
const { sessionToken, answers } = req.body;
if (!sessionToken || !answers || !Array.isArray(answers)) {
  return res.status(400).json({ error: 'กรุณาระบุ sessionToken และ answers' });
}
```

**การตรวจสอบ answers:**
- `!answers` = ตรวจสอบว่ามี answers หรือไม่
- `!Array.isArray(answers)` = ตรวจสอบว่า answers เป็น array หรือไม่
- ต้องเป็น array เพราะมีหลายคำตอบ

#### 2.2 ค้นหาผู้ใช้ด้วย Session Token
```javascript
const user = await User.findOne({ 
  resetToken: sessionToken,
  resetTokenExpiry: { $gt: Date.now() }
});
if (!user) {
  return res.status(400).json({ error: 'Session หมดอายุหรือไม่ถูกต้อง' });
}
```

**การทำงานของ MongoDB Query:**
- `resetToken: sessionToken` = หา user ที่มี resetToken ตรงกัน
- `resetTokenExpiry: { $gt: Date.now() }` = และยังไม่หมดอายุ
- `$gt` = greater than (มากกว่า)
- `Date.now()` = เวลาปัจจุบัน

#### 2.3 ตรวจสอบคำตอบ
```javascript
const correctAnswers = JSON.parse(user.tempSecurityAnswers || '[]');
let correctCount = 0;

for (const userAnswer of answers) {
  const correctAnswer = correctAnswers.find(a => a.id === userAnswer.id);
  if (correctAnswer && correctAnswer.answer.toLowerCase() === userAnswer.answer.toLowerCase()) {
    correctCount++;
  }
}
```

**การทำงานของการตรวจสอบ:**
- `JSON.parse()` = แปลง JSON string กลับเป็น JavaScript object
- `|| '[]'` = ถ้าไม่มีข้อมูลให้ใช้ empty array
- `for...of` = วนลูปผ่าน answers ที่ผู้ใช้ส่งมา
- `.find()` = หาคำตอบที่ถูกต้องด้วย id
- `.toLowerCase()` = แปลงเป็นตัวพิมพ์เล็กทั้งคู่เพื่อเปรียบเทียบ
- `correctCount++` = นับจำนวนคำตอบที่ถูก

#### 2.4 ตรวจสอบผลลัพธ์
```javascript
if (correctCount < 2) {
  console.log(`❌ Security Questions ผิด: ${user.username} ตอบถูก ${correctCount}/2`);
  return res.status(400).json({ 
    error: `ตอบคำถามไม่ถูกต้อง (ถูก ${correctCount}/2)`,
    hint: 'กรุณาตรวจสอบคำตอบและลองใหม่'
  });
}
```

**เงื่อนไขการผ่าน:**
- ต้องตอบถูกอย่างน้อย 2 ข้อ (จาก 2 ข้อที่ถาม)
- ถ้าตอบผิดจะแสดงจำนวนที่ตอบถูก
- มี hint เพื่อช่วยผู้ใช้

#### 2.5 สร้าง Reset Token
```javascript
const resetToken = crypto.randomBytes(32).toString('hex');
const resetTokenExpiry = Date.now() + 3600000; // 1 ชั่วโมง

await User.findOneAndUpdate(
  { _id: user._id },
  { 
    resetToken: resetToken,
    resetTokenExpiry: resetTokenExpiry,
    tempSecurityAnswers: undefined
  }
);
```

**การทำงาน:**
- สร้าง reset token ใหม่ (32 bytes = 64 ตัวอักษร)
- กำหนดอายุ 1 ชั่วโมง (3,600,000 มิลลิวินาที)
- ลบ `tempSecurityAnswers` ออก (ตั้งเป็น undefined)
- อัปเดตด้วย `_id` เพื่อความแน่นอน

### 3. 🔄 resetPassword() - เปลี่ยนรหัสผ่าน

#### 3.1 ตรวจสอบข้อมูล
```javascript
const { token, newPassword } = req.body;
if (!token || !newPassword) {
  return res.status(400).json({ error: 'กรุณาระบุ token และรหัสผ่านใหม่' });
}
if (newPassword.length < 4) {
  return res.status(400).json({ error: 'รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร' });
}
```

#### 3.2 ตรวจสอบ Token
```javascript
const user = await User.findOne({ 
  resetToken: token,
  resetTokenExpiry: { $gt: Date.now() } 
});
if (!user) {
  return res.status(400).json({ error: 'Token ไม่ถูกต้องหรือหมดอายุแล้ว' });
}
```

#### 3.3 เข้ารหัสและบันทึกรหัสผ่านใหม่
```javascript
const saltRounds = 10;
const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

await User.findOneAndUpdate(
  { _id: user._id },
  { 
    password: hashedNewPassword,
    resetToken: undefined,
    resetTokenExpiry: undefined,
    tempSecurityAnswers: undefined
  }
);
```

**การทำงาน:**
- เข้ารหัสรหัสผ่านใหม่ด้วย bcrypt
- อัปเดตรหัสผ่านในฐานข้อมูล
- ลบ token และข้อมูลชั่วคราวทั้งหมด
- ป้องกันการใช้ token ซ้ำ

### 4. 🎯 testSecurityQuestions() - ทดสอบคำถาม (Dev Only)

#### 4.1 แสดงคำถามและคำตอบทั้งหมด
```javascript
const allQuestions = [
  {
    id: 1,
    question: `อีเมลของคุณขึ้นต้นด้วยอักษรอะไร?`,
    answer: user.email.charAt(0).toLowerCase(),
    hint: `ตัวอักษรแรกของอีเมล`
  },
  // ... คำถามอื่นๆ
];

res.json({
  message: 'คำถามความปลอดภัยสำหรับการทดสอบ',
  username: user.username,
  userInfo: {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
  },
  questions: allQuestions,
  note: 'API นี้สำหรับการทดสอบเท่านั้น ใน Production ไม่ควรแสดงคำตอบ'
});
```

**หน้าที่:**
- แสดงคำถามและคำตอบทั้งหมดสำหรับการทดสอบ
- ช่วยให้ developer ทดสอบระบบได้ง่าย
- ไม่ควรใช้ใน production

---

## 🛡️ ความปลอดภัยของระบบ Security Questions

### 🔒 การป้องกัน

#### 1. Session Management
- **Session Token:** ใช้ crypto.randomBytes(16) สร้าง token 32 ตัวอักษร
- **หมดอายุเร็ว:** 10 นาที เท่านั้น
- **ใช้ครั้งเดียว:** หลังตอบคำถามแล้วจะถูกแทนที่

#### 2. Answer Validation
- **ต้องตอบถูกทั้งหมด:** 2/2 ข้อ
- **Case Insensitive:** ไม่แยกตัวพิมพ์เล็ก-ใหญ่
- **Exact Match:** ต้องตรงกันทุกตัวอักษร

#### 3. Data Protection
- **ข้อมูลแสดงแบบซ่อน:** J***, D***, j***@example.com
- **คำตอบไม่ส่งกลับ:** เก็บไว้ในฐานข้อมูลเท่านั้น
- **ลบข้อมูลชั่วคราว:** หลังใช้งานเสร็จ

#### 4. Token Security
- **Reset Token:** ใช้ crypto.randomBytes(32) สร้าง token 64 ตัวอักษร
- **หมดอายุ 1 ชั่วโมง:** ป้องกันการใช้ซ้ำ
- **ใช้ได้ครั้งเดียว:** หลังเปลี่ยนรหัสแล้วจะถูกลบ

### 🎯 ข้อดีของระบบนี้

#### 1. ไม่ต้องพึ่งอีเมล
- ไม่ต้องตั้งค่าระบบส่งอีเมล
- ไม่ต้องกังวลเรื่องอีเมลไปขยะ
- ใช้งานได้ทันทีหลังติดตั้ง

#### 2. ข้อมูลที่มีอยู่
- ใช้ข้อมูลที่มีในระบบแล้ว
- ไม่ต้องเก็บข้อมูลเพิ่ม
- คำถามสร้างอัตโนมัติ

#### 3. ความปลอดภัยพอสมควร
- ต้องรู้ข้อมูลส่วนตัวของผู้ใช้
- ต้องตอบถูกทั้งหมด
- มี session และ token หมดอายุ

#### 4. ง่ายต่อการทดสอบ
- มี API สำหรับดูคำตอบ
- ไม่ต้องเช็คอีเมล
- ทดสอบได้ทันที

### ⚠️ ข้อจำกัด

#### 1. ความปลอดภัยต่ำกว่าอีเมล
- คนที่รู้ข้อมูลส่วนตัวสามารถรีเซ็ตได้
- ไม่มีการยืนยันตัตน 2 ชั้น

#### 2. ต้องมีข้อมูลครบ
- ต้องมีชื่อ, นามสกุล, อีเมล
- ถ้าข้อมูลไม่ครบจะสร้างคำถามไม่ได้

#### 3. คำถามจำกัด
- มีแค่ 3 แบบ
- อาจเดาได้ถ้ารู้ข้อมูล

### 🔄 การใช้งานจริง

#### Scenario 1: ผู้ใช้ลืมรหัสผ่าน
1. ผู้ใช้เข้า API `/forgotpassword` ด้วย username
2. ระบบสร้างคำถาม 2 ข้อจากข้อมูลผู้ใช้
3. ผู้ใช้ตอบคำถาม
4. ถ้าตอบถูกจะได้ reset token
5. ใช้ token เปลี่ยนรหัสผ่านใหม่

#### Scenario 2: Admin ช่วยผู้ใช้
1. Admin เรียก API `/test-security-questions` ดูคำตอบ
2. Admin ช่วยผู้ใช้ทำตามขั้นตอน
3. ผู้ใช้ได้รหัสผ่านใหม่

---

**ระบบ Security Questions นี้เหมาะสำหรับองค์กรที่ต้องการความง่ายและไม่ต้องการตั้งค่าระบบอีเมล แต่ยังคงความปลอดภัยในระดับที่ยอมรับได้**

```javascript
const { username, email, phone, newPassword } = req.body;
```

**Parameters:**
- **username** (string, required): ชื่อผู้ใช้งาน
- **email** (string, required): อีเมลเพื่อยืนยันตัวตน
- **phone** (string, required): เบอร์โทรเพื่อยืนยันตัวตน  
- **newPassword** (string, required): รหัสผ่านใหม่ที่ต้องการตั้ง

#### 🔄 ขั้นตอนการทำงาน (ทีละบรรทัด)

### 1. 🔑 forgotPassword() - ยืนยันตัวตนและเปลี่ยนรหัสผ่าน

#### 1.1 รับข้อมูลจาก Request Body
```javascript
const { username, email, phone, newPassword } = req.body;
```
**อธิบาย:**
- **username:** ชื่อผู้ใช้งานที่ต้องการรีเซ็ตรหัสผ่าน
- **email:** อีเมลเพื่อยืนยันตัวตน
- **phone:** เบอร์โทรเพื่อยืนยันตัวตน
- **newPassword:** รหัสผ่านใหม่ที่ต้องการตั้ง

#### 1.2 ตรวจสอบข้อมูลครบถ้วน
```javascript
if (!username) {
  return res.status(400).json({ error: 'กรุณาระบุชื่อผู้ใช้งาน' });
}
if (!email) {
  return res.status(400).json({ error: 'กรุณาระบุอีเมลเพื่อยืนยันตัวตน' });
}
if (!phone) {
  return res.status(400).json({ error: 'กรุณาระบุเบอร์โทรศัพท์เพื่อยืนยันตัวตน' });
}
if (!newPassword) {
  return res.status(400).json({ error: 'กรุณาระบุรหัสผ่านใหม่ที่ต้องการตั้ง' });
}
```
**อธิบาย:** ตรวจสอบว่าข้อมูลทั้ง 4 อย่างครบถ้วนหรือไม่

#### 1.3 หาผู้ใช้ในฐานข้อมูล
```javascript
const user = await User.findOne({ username: username });
if (!user) {
  return res.status(404).json({ error: 'ไม่พบชื่อผู้ใช้งานนี้ในระบบ' });
}
```
**อธิบาย:**
- ใช้ `User.findOne()` หาผู้ใช้ด้วย username
- ถ้าไม่เจอจะส่ง error 404 กลับไป

#### 1.4 ยืนยันตัวตน
```javascript
if (user.email !== email || user.phone !== phone) {
  return res.status(401).json({ 
    error: 'ข้อมูลยืนยันตัวตน (อีเมลหรือเบอร์โทรศัพท์) ไม่ถูกต้อง' 
  });
}
```
**อธิบาย:**
- เปรียบเทียบอีเมลและเบอร์โทรที่ส่งมากับที่มีในฐานข้อมูล
- ต้องตรงทั้งคู่ถึงจะผ่าน
- ถ้าไม่ตรงจะส่ง error 401 (Unauthorized)

#### 1.5 เข้ารหัสรหัสผ่านใหม่
```javascript
const saltRounds = 10;
const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
```
**อธิบาย:**
- ใช้ bcrypt เข้ารหัสรหัสผ่านใหม่
- saltRounds = 10 เพื่อความปลอดภัยสูง
- `await` เพราะ bcrypt.hash() เป็น async function

#### 1.6 อัปเดตรหัสผ่านในฐานข้อมูล
```javascript
await User.findOneAndUpdate(
  { username: username },
  { password: hashedNewPassword },
  { new: true }
);
```
**อธิบาย:**
- ใช้ `findOneAndUpdate()` หาและอัปเดตในคำสั่งเดียว
- อัปเดตเฉพาะฟิลด์ password
- `{ new: true }` เพื่อให้ return ข้อมูลใหม่ (แต่เราไม่ได้ใช้)

#### 1.7 ส่ง Response กลับ
```javascript
res.json({
  message: 'รีเซ็ตรหัสผ่านเรียบร้อยแล้ว คุณสามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้ทันที',
  username: username
});
```
**อธิบาย:**
- ส่งข้อความยืนยันการเปลี่ยนรหัสผ่านสำเร็จ
- ส่ง username กลับไปเพื่อยืนยัน
- ไม่ส่งรหัสผ่านใหม่กลับไปเพื่อความปลอดภัย

## 🛡️ ความปลอดภัยของระบบยืนยันตัวตน

### 🔒 การป้องกัน
1. **ยืนยันตัวตนหลายชั้น** - ต้องรู้ username + email + phone
2. **เข้ารหัสรหัสผ่าน** - ใช้ bcrypt saltRounds = 10
3. **ไม่มี token หรือ session** - ลดจุดอ่อนด้านความปลอดภัย
4. **เปลี่ยนทันที** - ไม่มีช่วงเวลาเสี่ยง

### 🎯 ข้อดี
- **ง่ายมาก** - 1 ขั้นตอนเดียว
- **ไม่ต้องตั้งค่าอีเมล** - ใช้งานได้ทันที
- **ผู้ใช้ทำเอง** - ไม่ต้องรอแอดมิน
- **ปลอดภัยพอสมควร** - ต้องรู้ข้อมูลส่วนตัว 3 อย่าง
- **รวดเร็ว** - เปลี่ยนรหัสผ่านได้ทันที

**ระบบยืนยันตัวตนนี้เหมาะสำหรับองค์กรที่ต้องการความง่ายและไม่ต้องการตั้งค่าระบบซับซ้อน แต่ยังคงความปลอดภัยในระดับที่ยอมรับได้**