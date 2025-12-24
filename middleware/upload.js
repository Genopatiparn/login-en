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
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 70 * 1024 
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('รองรับเฉพาะไฟล์รูปภาพ '));
    }
  }
});
function handleFileUpload(req, res, next) {
  const contentType = req.headers['content-type'] || '';
  
  if (contentType.includes('multipart/form-data')) {
    return upload.any()(req, res, function (err) {
      if (err) {
        console.error('เกิดข้อผิดพลาดในการ upload:', err);

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
        
        return res.status(400).json({ 
          error: 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์: ' + err.message 
        });
      }

      if (req.files && req.files.length > 0) {
        req.uploadedImage = req.files[0].filename;
        console.log(`อัปโหลดรูปภาพสำเร็จ: ${req.files[0].filename} (${req.files[0].size} bytes)`);
      }
      
      next();
    });
  }
  
  next();
}

module.exports = { handleFileUpload };