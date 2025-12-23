const Person = require('../../models/Person');
const { handleFileUpload } = require('../../middleware/upload');
const { validatePersonData } = require('../../middleware/validation');
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
function createPerson(req, res) {
  handleFileUpload(req, res, () => {
    validatePersonData(req, res, () => {
      processCreatePerson(req, res);
    });
  });
}

function processCreatePerson(req, res) {
  if (!req.uploadedImage && !req.body.image) {
    return res.status(400).json({ 
      error: 'กรุณาอัปโหลดรูปภาพ (ขนาดไม่เกิน 70KB, รองรับ jpg, jpeg, png, gif)' 
    });
  }

  let imagePath = '';
  if (req.uploadedImage) {
    imagePath = req.uploadedImage;
  }

  if (req.body.numberOfChildren !== undefined && req.body.numberOfChildren !== '') {
    const numChildren = parseNumber(req.body.numberOfChildren, null);
    if (numChildren === null) {
      return res.status(400).json({ 
        error: 'จำนวนลูกต้องเป็นตัวเลขเท่านั้น (หรือไม่ต้องใส่ก็ได้)',
        receivedValue: req.body.numberOfChildren
      });
    }
  }

  const personData = {
    ...(req.body.id && { id: req.body.id }),
    thaiTitle: req.body.thaiTitle || '',
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    englishTitle: req.body.englishTitle || '',
    englishFirstName: req.body.englishFirstName || '',
    englishMiddleName: req.body.englishMiddleName || '',
    englishLastName: req.body.englishLastName || '',
    nickname: req.body.nickname || '',
    formerName: req.body.formerName || '',
    age: parseNumber(req.body.age),
    phone: req.body.phone || '',
    phoneSecondary: req.body.phoneSecondary || '',
    email: req.body.email,
    workEmail: req.body.workEmail || '',
    type: req.body.type || 'student',
    nationalId: req.body.nationalId || '',
    idCardIssueDate: req.body.idCardIssueDate || '',
    idCardExpiryDate: req.body.idCardExpiryDate || '',
    birthDate: req.body.birthDate || '',
    birthProvince: req.body.birthProvince || '',
    birthDistrict: req.body.birthDistrict || '',
    nationality: req.body.nationality || 'ไทย',
    race: req.body.race || 'ไทย',
    religion: req.body.religion || 'พุทธ',
    physicalMarks: req.body.physicalMarks || '',
    regHouseNumber: req.body.regHouseNumber || '',
    regMoo: req.body.regMoo || '',
    regSoi: req.body.regSoi || '',
    regRoad: req.body.regRoad || '',
    regSubDistrict: req.body.regSubDistrict || '',
    regDistrict: req.body.regDistrict || '',
    regProvince: req.body.regProvince || '',
    regPostalCode: req.body.regPostalCode || '',
    curHouseNumber: req.body.curHouseNumber || '',
    curMoo: req.body.curMoo || '',
    curSoi: req.body.curSoi || '',
    curRoad: req.body.curRoad || '',
    curSubDistrict: req.body.curSubDistrict || '',
    curDistrict: req.body.curDistrict || '',
    curProvince: req.body.curProvince || '',
    curPostalCode: req.body.curPostalCode || '',
    residenceType: req.body.residenceType || '',
    lineId: req.body.lineId || '',
    facebookUrl: req.body.facebookUrl || '',
    linkedinUrl: req.body.linkedinUrl || '',
    instagramUrl: req.body.instagramUrl || '',
    fatherName: req.body.fatherName || '',
    fatherAge: req.body.fatherAge || '',
    fatherOccupation: req.body.fatherOccupation || '',
    fatherPhone: req.body.fatherPhone || '',
    fatherStatus: req.body.fatherStatus || '',
    motherName: req.body.motherName || '',
    motherAge: req.body.motherAge || '',
    motherOccupation: req.body.motherOccupation || '',
    motherPhone: req.body.motherPhone || '',
    motherStatus: req.body.motherStatus || '',
    maritalStatus: req.body.maritalStatus || '',
    marriageDate: req.body.marriageDate || '',
    spouseName: req.body.spouseName || '',
    spouseOccupation: req.body.spouseOccupation || '',
    spouseWorkplace: req.body.spouseWorkplace || '',
    spousePhone: req.body.spousePhone || '',
    numberOfChildren: parseNumber(req.body.numberOfChildren, 0),
    childName1: req.body.childName1 || '',
    childAge1: req.body.childAge1 || '',
    childSchool1: req.body.childSchool1 || '',
    childName2: req.body.childName2 || '',
    childAge2: req.body.childAge2 || '',
    childSchool2: req.body.childSchool2 || '',
    childName3: req.body.childName3 || '',
    childAge3: req.body.childAge3 || '',
    childSchool3: req.body.childSchool3 || '',
    edu1Level: req.body.edu1Level || '',
    edu1Institution: req.body.edu1Institution || '',
    edu1Major: req.body.edu1Major || '',
    edu1Gpa: req.body.edu1Gpa || '',
    edu1GraduationYear: req.body.edu1GraduationYear || '',
    edu2Level: req.body.edu2Level || '',
    edu2Institution: req.body.edu2Institution || '',
    edu2Major: req.body.edu2Major || '',
    edu2Gpa: req.body.edu2Gpa || '',
    edu2GraduationYear: req.body.edu2GraduationYear || '',
    certificates: req.body.certificates || '',
    languages: req.body.languages || '',
    testScores: req.body.testScores || '',
    computerSkills: req.body.computerSkills || '',
    specialSkills: req.body.specialSkills || '',
    work1Company: req.body.work1Company || '',
    work1Position: req.body.work1Position || '',
    work1StartDate: req.body.work1StartDate || '',
    work1EndDate: req.body.work1EndDate || '',
    work1Salary: req.body.work1Salary || '',
    work1ResignationReason: req.body.work1ResignationReason || '',
    work2Company: req.body.work2Company || '',
    work2Position: req.body.work2Position || '',
    work2StartDate: req.body.work2StartDate || '',
    work2EndDate: req.body.work2EndDate || '',
    work2Salary: req.body.work2Salary || '',
    work2ResignationReason: req.body.work2ResignationReason || '',
    militaryStatus: req.body.militaryStatus || '',
    passportNumber: req.body.passportNumber || '',
    passportIssueDate: req.body.passportIssueDate || '',
    passportExpiryDate: req.body.passportExpiryDate || '',
    carLicenseNumber: req.body.carLicenseNumber || '',
    carLicenseExpiry: req.body.carLicenseExpiry || '',
    motorcycleLicenseNumber: req.body.motorcycleLicenseNumber || '',
    motorcycleLicenseExpiry: req.body.motorcycleLicenseExpiry || '',
    publicTransportLicenseNumber: req.body.publicTransportLicenseNumber || '',
    publicTransportLicenseExpiry: req.body.publicTransportLicenseExpiry || '',
    workPermitNumber: req.body.workPermitNumber || '',
    workPermitIssueDate: req.body.workPermitIssueDate || '',
    workPermitExpiryDate: req.body.workPermitExpiryDate || '',
    height: req.body.height || '',
    weight: req.body.weight || '',
    bloodType: req.body.bloodType || '',
    shirtSize: req.body.shirtSize || '',
    waistSize: req.body.waistSize || '',
    shoeSize: req.body.shoeSize || '',
    chestSize: req.body.chestSize || '',
    headSize: req.body.headSize || '',
    colorBlindness: req.body.colorBlindness || '',
    chronicDiseases: req.body.chronicDiseases || '',
    allergies: req.body.allergies || '',
    surgeryHistory: req.body.surgeryHistory || '',
    smokingHistory: req.body.smokingHistory || '',
    drinkingHistory: req.body.drinkingHistory || '',
    vaccinations: req.body.vaccinations || '',
    image: imagePath || req.body.image || '' 
  };

  const person = new Person(personData);
  person.save()
    .then(function(newPerson) {
      res.status(201).json({
        message: 'สร้างข้อมูลเรียบร้อยแล้ว',
        person: newPerson
      });
    })
    .catch(function(error) {
      console.error('เกิดข้อผิดพลาดในการสร้างข้อมูล:', error);
      res.status(500).json({ error: 'เกิดข้อผิดพลาดในการสร้างข้อมูล' });
    });
}
module.exports = createPerson;