const Person = require('../../models/Person');
const { handleFileUpload } = require('../../middleware/upload');
const { checkDuplicateId } = require('../../middleware/validation');

function updatePerson(req, res) {
  handleFileUpload(req, res, () => {
    checkDuplicateId(Person)(req, res, () => {
      processUpdatePerson(req, res);
    });
  });
}
async function processUpdatePerson(req, res) {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ error: 'กรุณาระบุ ID' });
  }

  try {
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.__v;

    if (req.uploadedImage) {
      updateData.image = req.uploadedImage;
    }

    if (!updateData.id) {
      updateData.id = id;
    }

    const updatedPerson = await Person.findOneAndUpdate({ id: id }, updateData, { new: true });

    if (!updatedPerson) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลที่ต้องการแก้ไข' });
    }
    
    res.json({
      message: 'แก้ไขข้อมูลเรียบร้อยแล้ว',
      person: updatedPerson
    });
    
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการแก้ไขข้อมูล:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล' });
  }
}

module.exports = updatePerson;