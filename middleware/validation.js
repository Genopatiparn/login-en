async function checkDuplicateId(Model) {
  return async function(req, res, next) {
    const { id } = req.body;
    const currentId = req.params.id;
    if (!id || id === currentId) {
      return next();
    }
    
    try {
      const existingRecord = await Model.findOne({ id: id });
      
      if (existingRecord) {
        return res.status(400).json({ 
          error: `รหัส "${id}" ถูกใช้งานแล้วโดยคนอื่น`
        });
      }
      
      next();
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการตรวจสอบ ID:', error);
      res.status(500).json({ error: 'เกิดข้อผิดพลาดในการตรวจสอบข้อมูล' });
    }
  };
}

function validatePersonData(req, res, next) {
  const { firstName, lastName, email } = req.body;
  
  if (!lastName) {
    return res.status(400).json({ error: 'กรุณาระบุนามสกุล' });
  }
  
  if (!email) {
    return res.status(400).json({ error: 'กรุณาระบุอีเมล' });
  }
  
  next();
}

function validateUserData(req, res, next) {
  const { username, password, email, firstName, lastName } = req.body;
  
  if (!username) {
    return res.status(400).json({ error: 'กรุณาระบุชื่อผู้ใช้งาน' });
  }
  
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
  
  next();
}

module.exports = { 
  checkDuplicateId, 
  validatePersonData, 
  validateUserData 
};