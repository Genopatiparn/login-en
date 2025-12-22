
const mongoose = require('mongoose');

function checkDatabaseConnection(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(500).json({ error: 'Database ไม่ได้เชื่อมต่อ' });
  }
  next();
}

module.exports = { checkDatabaseConnection };