const Person = require('../../models/Person');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = 'image-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

function updatePerson(req, res) {
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('multipart/form-data')) {
    return upload.any()(req, res, function (err) {
      if (err) {
        console.error('เกิดข้อผิดพลาดในการ parse form-data:', err);
        return res.status(400).json({ error: err.message });
      }
      return processUpdatePerson(req, res);
    });
  }
  return processUpdatePerson(req, res);
}

async function processUpdatePerson(req, res) {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ error: 'กรุณาระบุ ID' });
  }

  try {
 
    let imagePath = '';
    if (req.files && req.files.length > 0) {
      imagePath = req.files[0].filename;

    }

    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.__v;
    
    if (imagePath) {
      updateData.image = imagePath;
    }

    // ถ้าไม่ส่ง Custom ID มา ให้เก็บ Custom ID เดิมไว้ (แบบ junior dev)
    if (!updateData.id) {
      updateData.id = id;
    }

    // ตรวจสอบ Custom ID ใหม่ซ้ำไหม (แบบ junior dev)
    if (updateData.id && updateData.id !== id) {
      const existingPerson = await Person.findOne({ id: updateData.id });
      
      if (existingPerson) {
        return res.status(400).json({ 
          error: `รหัส "${updateData.id}" ถูกใช้งานแล้วโดยคนอื่น`
        });
      }
    }

    const updatedPerson = await Person.findOneAndUpdate({ id: id }, updateData, { new: true });

    if (!updatedPerson) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลที่ต้องการแก้ไข' });
    }
    
    res.json({
      message: 'แก้ไขข้อมูลเรียบร้อยแล้ว',
      person: updatedPerson
    });
    
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการแก้ไขข้อมูล:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล' });
  }
}

module.exports = updatePerson;