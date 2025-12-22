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
function handleFileUpload(req, res, next) {
  const contentType = req.headers['content-type'] || '';
  
  if (contentType.includes('multipart/form-data')) {
    return upload.any()(req, res, function (err) {
      if (err) {
        console.error('เกิดข้อผิดพลาดในการ parse form-data:', err);
        return res.status(400).json({ error: err.message });
      }

      if (req.files && req.files.length > 0) {
        req.uploadedImage = req.files[0].filename;
      }
      
      next();
    });
  }
  
  next();
}

module.exports = { handleFileUpload };