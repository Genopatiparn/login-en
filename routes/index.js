var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.json({
    message: 'Welcome to Authentication API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/users'
    }
  });
});

module.exports = router;
