const Person = require('../../models/Person');

async function deletePerson(req, res) {
  try {
    const id = req.params.id;

    // ค้นหาและลบด้วย Custom ID (แบบ junior dev)
    const person = await Person.findOne({ id: id });
    if (person) {
      await Person.findOneAndDelete({ id: id });
    }
    
    if (!person) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลที่ต้องการลบ' });
    }
    
    res.json({ 
      message: 'ลบข้อมูลเรียบร้อยแล้ว',
      deletedId: id
    });
    
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการลบข้อมูล:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบข้อมูล' });
  }
}
module.exports = deletePerson;