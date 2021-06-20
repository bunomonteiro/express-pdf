const express = require('express');
const configurations = require('../common/configurations');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render(
    'index', 
    { 
      title: configurations.app.title,
      description: configurations.app.description,
      version: configurations.app.version
    }
  );
});

module.exports = router;
