const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  // รหัสพนักงาน/รหัสนักเรียน (แยกจาก _id)
  id: { type: String, unique: true, sparse: true }, // sparse: true = ไม่บังคับต้องมี
  
  // ข้อมูลพื้นฐาน (บังคับ)
  thaiTitle: { type: String, default: '' },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  
  // ข้อมูลชื่อภาษาไทยและอังกฤษ
  englishTitle: { type: String, default: '' },
  englishFirstName: { type: String, default: '' },
  englishMiddleName: { type: String, default: '' },
  englishLastName: { type: String, default: '' },
  nickname: { type: String, default: '' },
  formerName: { type: String, default: '' },
  
  // ข้อมูลส่วนตัว
  age: { type: Number },
  phone: { type: String, default: '' },
  phoneSecondary: { type: String, default: '' },
  email: { type: String, required: true },
  workEmail: { type: String, default: '' },
  type: { type: String, default: 'student' },
  
  // ข้อมูลเอกสารประจำตัว
  nationalId: { type: String, default: '' },
  idCardIssueDate: { type: String, default: '' },
  idCardExpiryDate: { type: String, default: '' },
  birthDate: { type: String, default: '' },
  birthProvince: { type: String, default: '' },
  birthDistrict: { type: String, default: '' },
  nationality: { type: String, default: 'ไทย' },
  race: { type: String, default: 'ไทย' },
  religion: { type: String, default: 'พุทธ' },
  physicalMarks: { type: String, default: '' },
  
  // ที่อยู่ตามทะเบียนบ้าน
  regHouseNumber: { type: String, default: '' },
  regMoo: { type: String, default: '' },
  regSoi: { type: String, default: '' },
  regRoad: { type: String, default: '' },
  regSubDistrict: { type: String, default: '' },
  regDistrict: { type: String, default: '' },
  regProvince: { type: String, default: '' },
  regPostalCode: { type: String, default: '' },
  
  // ที่อยู่ปัจจุบัน
  curHouseNumber: { type: String, default: '' },
  curMoo: { type: String, default: '' },
  curSoi: { type: String, default: '' },
  curRoad: { type: String, default: '' },
  curSubDistrict: { type: String, default: '' },
  curDistrict: { type: String, default: '' },
  curProvince: { type: String, default: '' },
  curPostalCode: { type: String, default: '' },
  residenceType: { type: String, default: '' },
  
  // Social Media
  lineId: { type: String, default: '' },
  facebookUrl: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
  instagramUrl: { type: String, default: '' },
  
  // ข้อมูลครอบครัว - บิดา
  fatherName: { type: String, default: '' },
  fatherAge: { type: String, default: '' },
  fatherOccupation: { type: String, default: '' },
  fatherPhone: { type: String, default: '' },
  fatherStatus: { type: String, default: '' },
  
  // ข้อมูลครอบครัว - มารดา
  motherName: { type: String, default: '' },
  motherAge: { type: String, default: '' },
  motherOccupation: { type: String, default: '' },
  motherPhone: { type: String, default: '' },
  motherStatus: { type: String, default: '' },
  
  // ข้อมูลสถานภาพการสมรส
  maritalStatus: { type: String, default: '' },
  marriageDate: { type: String, default: '' },
  spouseName: { type: String, default: '' },
  spouseOccupation: { type: String, default: '' },
  spouseWorkplace: { type: String, default: '' },
  spousePhone: { type: String, default: '' },
  numberOfChildren: { type: Number, default: 0 },
  
  // ข้อมูลบุตร
  childName1: { type: String, default: '' },
  childAge1: { type: String, default: '' },
  childSchool1: { type: String, default: '' },
  childName2: { type: String, default: '' },
  childAge2: { type: String, default: '' },
  childSchool2: { type: String, default: '' },
  childName3: { type: String, default: '' },
  childAge3: { type: String, default: '' },
  childSchool3: { type: String, default: '' },
  
  // ข้อมูลการศึกษา
  edu1Level: { type: String, default: '' },
  edu1Institution: { type: String, default: '' },
  edu1Major: { type: String, default: '' },
  edu1Gpa: { type: String, default: '' },
  edu1GraduationYear: { type: String, default: '' },
  edu2Level: { type: String, default: '' },
  edu2Institution: { type: String, default: '' },
  edu2Major: { type: String, default: '' },
  edu2Gpa: { type: String, default: '' },
  edu2GraduationYear: { type: String, default: '' },
  
  // ใบรับรองและทักษะ
  certificates: { type: String, default: '' },
  languages: { type: String, default: '' },
  testScores: { type: String, default: '' },
  computerSkills: { type: String, default: '' },
  specialSkills: { type: String, default: '' },
  
  // ประวัติการทำงาน
  work1Company: { type: String, default: '' },
  work1Position: { type: String, default: '' },
  work1StartDate: { type: String, default: '' },
  work1EndDate: { type: String, default: '' },
  work1Salary: { type: String, default: '' },
  work1ResignationReason: { type: String, default: '' },
  work2Company: { type: String, default: '' },
  work2Position: { type: String, default: '' },
  work2StartDate: { type: String, default: '' },
  work2EndDate: { type: String, default: '' },
  work2Salary: { type: String, default: '' },
  work2ResignationReason: { type: String, default: '' },
  
  // ข้อมูลเอกสารราชการและการทหาร
  militaryStatus: { type: String, default: '' },
  passportNumber: { type: String, default: '' },
  passportIssueDate: { type: String, default: '' },
  passportExpiryDate: { type: String, default: '' },
  carLicenseNumber: { type: String, default: '' },
  carLicenseExpiry: { type: String, default: '' },
  motorcycleLicenseNumber: { type: String, default: '' },
  motorcycleLicenseExpiry: { type: String, default: '' },
  publicTransportLicenseNumber: { type: String, default: '' },
  publicTransportLicenseExpiry: { type: String, default: '' },
  workPermitNumber: { type: String, default: '' },
  workPermitIssueDate: { type: String, default: '' },
  workPermitExpiryDate: { type: String, default: '' },
  
  // ข้อมูลกายภาพ
  height: { type: String, default: '' },
  weight: { type: String, default: '' },
  bloodType: { type: String, default: '' },
  shirtSize: { type: String, default: '' },
  waistSize: { type: String, default: '' },
  shoeSize: { type: String, default: '' },
  chestSize: { type: String, default: '' },
  headSize: { type: String, default: '' },
  colorBlindness: { type: String, default: '' },
  
  // ข้อมูลสุขภาพ
  chronicDiseases: { type: String, default: '' },
  allergies: { type: String, default: '' },
  surgeryHistory: { type: String, default: '' },
  smokingHistory: { type: String, default: '' },
  drinkingHistory: { type: String, default: '' },
  vaccinations: { type: String, default: '' },
  
  // ไฟล์รูปภาพ
  image: { type: String, default: '' }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      // ไม่ต้องเปลี่ยน id แล้ว ให้ใช้ Custom ID ที่มีอยู่ (แบบ junior dev)
      // ถ้าไม่มี Custom ID ให้แสดงเป็น null
      if (!ret.id) {
        ret.id = null;
      }
      
      // แปลง createdAt และ updatedAt เป็น timezone +07:00 (Thailand)
      if (ret.createdAt) {
        const createdAtThailand = new Date(ret.createdAt.getTime() + (7 * 60 * 60 * 1000));
        ret.createdAt = createdAtThailand.toISOString().replace('Z', '+07:00');
      }
      if (ret.updatedAt) {
        const updatedAtThailand = new Date(ret.updatedAt.getTime() + (7 * 60 * 60 * 1000));
        ret.updatedAt = updatedAtThailand.toISOString().replace('Z', '+07:00');
      }
      return ret;
    }
  }
});

module.exports = mongoose.model('Person', personSchema);