const express = require('express');
const fs = require("fs");
const path = require("path");

const router = express.Router();
const isWindows = process.platform === 'win32';

router.post('/', function (req, res, next) {
  try {
    console.log('>> PDF creation request received...');

    const pdf = require("pdf-creator-node");
    const view = req.body.view || 'pdf';
    const defaultHtml = fs.readFileSync(__dirname + `/../views/${view}.hbs`, "utf8");

    const html = req.body.html || defaultHtml;

    const defaultOptions = {
      format: "A4",
      orientation: "portrait",
      border: "10mm"
    };

    let options = req.body.options || defaultOptions;
    
    if (!isWindows) {
      options.phantomPath = path.join(__dirname, '..', 'node_modules', 'phantomjs-prebuilt', 'bin', 'phantomjs')
    }

    const document = {
      html: html,
      data: req.body.data,
      type: 'buffer'
    }

    console.log('>> PDF creation started...');

    pdf.create(document, options)
      .then(response => {
        console.error('>> PDF created!')
        res.set('Content-Type', 'application/pdf')
          .send(response);
      })
      .catch(error => {
        console.error('>> PDF creation failed')
        console.error(error)
        res.status(500).send(error);
      });
  } catch (error) {
    console.log('>> Unhandled error');
    console.error(error)
    res.status(500).send(error);
  }
});

module.exports = router;