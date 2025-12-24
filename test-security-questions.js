// 🧪 สคริปต์ทดสอบระบบ Security Questions
// รันด้วยคำสั่ง: node test-security-questions.js

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/users';

async function testSecurityQuestionsSystem() {
  console.log('🧪 เริ่มทดสอบระบบ Security Questions...\n');

  try {
    const testUsername = 'admin'; // เปลี่ยนเป็น username ที่มีในระบบ

    // 1. ทดสอบดูคำถามความปลอดภัย (สำหรับ Dev)
    console.log('🔍 1. ดูคำถามความปลอดภัยสำหรับการทดสอบ...');
    const testResponse = await axios.post(`${BASE_URL}/test-security-questions`, {
      username: testUsername
    });

    console.log('✅ ดูคำถามสำเร็จ!');
    console.log(`👤 ผู้ใช้: ${testResponse.data.username}`);
    console.log(`📧 อีเมล: ${testResponse.data.userInfo.email}`);
    console.log(`👨 ชื่อ: ${testResponse.data.userInfo.firstName}`);
    console.log(`👨 นามสกุล: ${testResponse.data.userInfo.lastName}`);
    
    console.log('\n📋 คำถามทั้งหมด:');
    testResponse.data.questions.forEach((q, index) => {
      console.log(`   ${index + 1}. ${q.question}`);
      console.log(`      คำตอบ: "${q.answer}"`);
      console.log(`      คำใบ้: ${q.hint}`);
    });

    // 2. เริ่มกระบวนการ Forgot Password
    console.log('\n🔑 2. เริ่มกระบวนการ Forgot Password...');
    const forgotResponse = await axios.post(`${BASE_URL}/forgotpassword`, {
      username: testUsername
    });

    console.log('✅ สร้างคำถามความปลอดภัยสำเร็จ!');
    console.log(`🎫 Session Token: ${forgotResponse.data.sessionToken}`);
    console.log(`👤 ข้อมูลผู้ใช้: ${JSON.stringify(forgotResponse.data.userInfo)}`);
    
    console.log('\n❓ คำถามที่ต้องตอบ:');
    forgotResponse.data.securityQuestions.forEach((q, index) => {
      console.log(`   ${index + 1}. ${q.question}`);
      console.log(`      คำใบ้: ${q.hint}`);
    });

    // 3. ตอบคำถามความปลอดภัย (ใช้คำตอบจาก step 1)
    console.log('\n🔍 3. ตอบคำถามความปลอดภัย...');
    
    // สร้างคำตอบจากข้อมูลที่ได้
    const answers = forgotResponse.data.securityQuestions.map(q => {
      const correctAnswer = testResponse.data.questions.find(tq => tq.id === q.id);
      return {
        id: q.id,
        answer: correctAnswer.answer
      };
    });

    console.log('📝 คำตอบที่ส่ง:', answers);

    const verifyResponse = await axios.post(`${BASE_URL}/verify-security-answers`, {
      sessionToken: forgotResponse.data.sessionToken,
      answers: answers
    });

    console.log('✅ ตอบคำถามถูกต้อง!');
    console.log(`🔐 Reset Token: ${verifyResponse.data.resetData.resetToken}`);
    console.log(`⏰ หมดอายุ: ${verifyResponse.data.resetData.expiryTimeLocal}`);
    console.log(`✅ ตอบถูก: ${verifyResponse.data.resetData.correctAnswers} ข้อ`);

    // 4. รีเซ็ตรหัสผ่านด้วย Token
    console.log('\n🔄 4. รีเซ็ตรหัสผ่านด้วย Token...');
    const resetResponse = await axios.post(`${BASE_URL}/resetpassword`, {
      token: verifyResponse.data.resetData.resetToken,
      newPassword: 'newpass123'
    });

    console.log('✅ รีเซ็ตรหัสผ่านสำเร็จ!');
    console.log(`👤 ผู้ใช้: ${resetResponse.data.user.username}`);
    console.log(`📧 อีเมล: ${resetResponse.data.user.email}`);

    // 5. ทดสอบเข้าสู่ระบบด้วยรหัสผ่านใหม่
    console.log('\n🔑 5. ทดสอบเข้าสู่ระบบด้วยรหัสผ่านใหม่...');
    const loginResponse = await axios.post(`${BASE_URL}/login`, {
      username: testUsername,
      password: 'newpass123'
    });

    console.log('✅ เข้าสู่ระบบด้วยรหัสผ่านใหม่สำเร็จ!');
    console.log(`👤 ผู้ใช้: ${loginResponse.data.user.username}`);

    console.log('\n🎉 การทดสอบเสร็จสิ้น! ระบบ Security Questions ทำงานได้ปกติ');

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      console.log('\n💡 แนะนำ:');
      console.log('- ตรวจสอบว่าเซิร์ฟเวอร์ทำงานอยู่หรือไม่');
      console.log('- ตรวจสอบว่ามีผู้ใช้ในระบบหรือไม่');
      console.log('- เปลี่ยน testUsername ในโค้ด');
    }
  }
}

// ทดสอบตอบคำถามผิด
async function testWrongAnswers() {
  console.log('\n🧪 ทดสอบตอบคำถามผิด...');
  
  try {
    const testUsername = 'admin';

    // เริ่มกระบวนการ
    const forgotResponse = await axios.post(`${BASE_URL}/forgotpassword`, {
      username: testUsername
    });

    // ตอบคำถามผิด
    const wrongAnswers = forgotResponse.data.securityQuestions.map(q => ({
      id: q.id,
      answer: 'wrong-answer'
    }));

    console.log('📝 ส่งคำตอบผิด:', wrongAnswers);

    try {
      await axios.post(`${BASE_URL}/verify-security-answers`, {
        sessionToken: forgotResponse.data.sessionToken,
        answers: wrongAnswers
      });
      console.log('❌ ไม่ควรผ่านเมื่อตอบผิด!');
    } catch (error) {
      console.log('✅ ระบบตรวจจับคำตอบผิดได้ถูกต้อง');
      console.log(`   ข้อความ: ${error.response.data.error}`);
    }

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการทดสอบคำตอบผิด:', error.response?.data || error.message);
  }
}

// รันการทดสอบ
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--wrong')) {
    await testWrongAnswers();
  } else {
    await testSecurityQuestionsSystem();
    await testWrongAnswers();
  }
}

main();

console.log('\n📖 วิธีใช้:');
console.log('node test-security-questions.js        # ทดสอบระบบทั้งหมด');
console.log('node test-security-questions.js --wrong # ทดสอบแค่คำตอบผิด');