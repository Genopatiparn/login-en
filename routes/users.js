var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({ 
    message: 'Users endpoint',
    note: 'Use /api/auth/users to get user list'
  });
});

module.exports = router;
