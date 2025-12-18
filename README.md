# Person Management API - โปรเจค Junior Developer

โปรเจคนี้เป็น REST API สำหรับจัดการข้อมูลบุคคล เขียนด้วย Node.js และ Express.js เชื่อมต่อกับ MongoDB

## สิ่งที่โปรเจคนี้ทำได้

- สมัครสมาชิก เข้าสู่ระบบ ออกจากระบบ
- เพิ่ม แก้ไข ลบ ดูข้อมูลบุคคล
- เก็บข้อมูลใน MongoDB

## วิธีการติดตั้ง

1. **ติดตั้ง dependencies**
   ```bash
   npm install
   ```

2. **ตั้งค่า .env**
   ```bash
   cp .env.example .env
   ```
   แก้ไขไฟล์ .env ใส่ connection string ของ MongoDB

3. **รันโปรเจค**
   ```bash
   npm start
   ```

## API ที่มี

### สมัครสมาชิก
```http
POST /api/users/register

{
  "username": "john",
  "password": "123456",
  "email": "john@email.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

### เข้าสู่ระบบ
```http
POST /api/users/login

{
  "username": "john",
  "password": "123456"
}
```

### ออกจากระบบ
```http
POST /api/users/logout

{
  "username": "john"
}
```

### เพิ่มข้อมูลบุคคล
```http
POST /api/persons

{
  "firstName": "สมชาย",
  "lastName": "ใจดี",
  "email": "somchai@email.com",
  "age": 25,
  "phone": "0812345678",
  "type": "student"
}
```

### ดูข้อมูลบุคคลทั้งหมด
```http
GET /api/persons
```

### แก้ไขข้อมูลบุคคล
```http
PUT /api/persons/:id

{
  "firstName": "สมชาย",
  "lastName": "ใจดี",
  "age": 26
}
```

### ลบข้อมูลบุคคล
```http
DELETE /api/persons/:id
```

## โครงสร้างโปรเจค

```
├── app.js                    # ไฟล์หลัก
├── config/
│   └── database.js          # เชื่อมต่อ MongoDB
├── models/
│   ├── User.js             # โมเดลผู้ใช้งาน
│   ├── Person.js           # โมเดลบุคคล
│   └── LoggedInUser.js     # เก็บสถานะการเข้าสู่ระบบ
├── routes/
│   ├── auth/               # API เกี่ยวกับการเข้าสู่ระบบ
│   └── persons/            # API เกี่ยวกับข้อมูลบุคคล
└── utils/                   # ไฟล์ช่วยเหลือ (ว่าง)
```

## เทคโนโลยีที่ใช้

- **Node.js** - รันโปรแกรม JavaScript
- **Express.js** - สร้าง web server
- **MongoDB** - ฐานข้อมูล
- **Mongoose** - เชื่อมต่อ MongoDB

## ตัวอย่างการใช้งาน

1. สมัครสมาชิกก่อน
2. เข้าสู่ระบบ
3. เพิ่มข้อมูลบุคคล
4. ดูข้อมูลที่เพิ่มไว้
5. ออกจากระบบ

## หมายเหตุ

- โปรเจคนี้เหมาะสำหรับ Junior Developer ที่เพิ่งเริ่มเรียนรู้
- โค้ดเขียนแบบง่าย ๆ ไม่ซับซ้อน
- ยังไม่มี validation ที่ซับซ้อน
- ยังไม่มี security ขั้นสูง