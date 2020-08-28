const puppeteer = require("puppeteer");

(async () => {

  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 200,
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: 640,
    height: 480,
    deviceScaleFactor: 1,
  });

  await page.goto("https://techcrunch.com/tag/series-a/");

  page.click("[name='agree']");
  page.waitFor(1500);
  page.waitForSelector("a.post-block__title__link");
  // page.click("a.post-block__title__link");
})();
