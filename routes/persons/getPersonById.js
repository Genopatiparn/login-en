const Person = require('../../models/Person');
const { checkDatabaseConnection } = require('../../middleware/database');
function getPersonById(req, res) {
  checkDatabaseConnection(req, res, () => {
    processGetPersonById(req, res);
  });
}

async function processGetPersonById(req, res) {
  try {
    const id = req.params.id;
    const person = await Person.findOne({ id: id });
    
    if (!person) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลบุคคล' });
    }
    res.json({
      message: 'ดึงข้อมูลบุคคลสำเร็จ',
      person: person
    });
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลบุคคล:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
  }
}

module.exports = getPersonById;
