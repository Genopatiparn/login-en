var express = require('express');
var router = express.Router();
const getAllPersons = require('./getAllPersons');
const getPersonById = require('./getPersonById');
const createPerson = require('./createPerson');
const updatePerson = require('./updatePerson');
const deletePerson = require('./deletePerson');

router.get('/', getAllPersons);
router.get('/:id', getPersonById);
router.post('/', createPerson);  
router.put('/:id', updatePerson);
router.delete('/:id', deletePerson);

module.exports = router;