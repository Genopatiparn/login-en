const Person = require('../../models/Person');

function getAllPersons(req, res) {
  // ดึงข้อมูลบุคคลทั้งหมด
  Person.find({})
    .then(function(persons) {
      res.json({
        message: 'ดึงข้อมูลบุคคลทั้งหมดสำเร็จ',
        persons: persons,
        total: persons.length
      });
    })
    .catch(function(error) {
      console.error('เกิดข้อผิดพลาดในการดึงข้อมูลบุคคล:', error);
      res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
    });
}

module.exports = getAllPersons;
