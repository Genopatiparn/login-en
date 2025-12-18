const Person = require('../../models/Person');
module.exports = async (req, res) => {
  try {
    const id = req.params.id;
    // ค้นหาด้วย Custom ID (แบบ junior dev)
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
};
