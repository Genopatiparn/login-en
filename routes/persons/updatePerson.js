const Person = require('../../models/Person');

function updatePerson(req, res) {
  const id = req.params.id;

  // วิธี junior dev: ใช้ req.body ตรงๆ แต่เช็คว่ามี id ไหม
  if (!id) {
    return res.status(400).json({ error: 'กรุณาระบุ ID' });
  }

  // ลบ _id และ __v ออกจาก req.body เพื่อป้องกันปัญหา
  const updateData = { ...req.body };
  delete updateData._id;
  delete updateData.__v;

  Person.findByIdAndUpdate(id, updateData, { new: true })
    .then(function(updatedPerson) {
      if (!updatedPerson) {
        return res.status(404).json({ error: 'ไม่พบข้อมูลที่ต้องการแก้ไข' });
      }
      res.json({
        message: 'แก้ไขข้อมูลเรียบร้อยแล้ว',
        person: updatedPerson
      });
    })
    .catch(function(error) {
      console.error('เกิดข้อผิดพลาดในการแก้ไขข้อมูล:', error);
      res.status(500).json({ error: 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล' });
    });
}

module.exports = updatePerson;