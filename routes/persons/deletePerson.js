const Person = require('../../models/Person');

function deletePerson(req, res) {
  const id = req.params.id;
  
  Person.findById(id)
    .then(function(person) {
      if (!person) {
        return res.status(404).json({ error: 'ไม่พบข้อมูลที่ต้องการลบ' });
      }
      
      return Person.findByIdAndDelete(id);
    })
    .then(function(result) {
      if (result) {
        res.json({ message: 'ลบข้อมูลเรียบร้อยแล้ว' });
      } else {
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบข้อมูล' });
      }
    })
    .catch(function(error) {
      console.error('เกิดข้อผิดพลาดในการลบข้อมูล:', error);
      res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบข้อมูล' });
    });
}

module.exports = deletePerson;