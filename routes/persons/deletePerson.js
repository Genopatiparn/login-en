const Person = require('../../models/Person');
const { checkDatabaseConnection } = require('../../middleware/database');
function deletePerson(req, res) {
  checkDatabaseConnection(req, res, () => {
    processDeletePerson(req, res);
  });
}
async function processDeletePerson(req, res) {
  try {
    const id = req.params.id
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