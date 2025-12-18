var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.json({
    success: true,
    message: 'Server Status',
    data: {
      server: 'Person Management API',
      version: '1.0.0',
      uptime: process.uptime(),
      database: 'MongoDB Connected',
      endpoints: {
        auth: '/api/users',
        persons: '/api/persons',
        status: '/api/status'
      }
    }
  });
});

module.exports = router;