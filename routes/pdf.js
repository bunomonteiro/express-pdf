const express = require('express');
const fs = require("fs");
const Puppeteer = require('puppeteer-core');
const Handlebars = require('handlebars');

const router = express.Router();

router.post('/', async (request, response, next) => {
  let page = undefined;

  try {
    console.log('>> PDF creation request received...');

    const view = request.body.view || 'pdf';
    const defaultHtml = fs.readFileSync(__dirname + `/../views/${view}.hbs`, "utf8");
    const html = request.body.html || defaultHtml;

    const defaultOptions = {
      format: "A4",
      orientation: "portrait",
      border: "10mm"
    };

    let options = request.body.options || defaultOptions;
    options.timeout = 0;
    // #begin backward compatibility
    options.landscape = options.orientation === "landscape";
    options.margin = {
      top: options.border,
      right: options.border,
      bottom: options.border,
      left: options.border
    }
    // #end

    const document = {
      html: html,
      data: request.body.data,
      type: 'buffer'
    }

    const template = Handlebars.compile(document.html);
    const outputHtml = template(document.data);

    console.log('>> PDF creation started...');

    const browser = await Puppeteer.connect({
      browserWSEndpoint: chromeWsEndpoint
    });

    page = await browser.newPage();
    await page.emulateMediaType('screen');
    console.log('>> New page created');

    await page.setContent(outputHtml);
    console.log('>> The page received new content');

    const pdf = await page.pdf(options);
    console.log('>> PDF generated');

    response.set('Content-Type', 'application/pdf').send(pdf);

    page.close();
    console.log('>> The page was closed');
  } catch (error) {
    console.log('>> Unhandled error');
    console.error(error);

    if (page) {
      try {
        page.close();
      } catch {}
    }

    response.status(500).send(error);
  }
});

module.exports = router;