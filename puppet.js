const puppeteer = require("puppeteer");

(async () => {

  const website = "https://techcrunch.com/tag/series-a/"

  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: 640,
    height: 480,
    deviceScaleFactor: 1,
  });

  await page.goto(website);

  page.click("[name='agree']");

  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  page.waitFor(1500);
  page.waitForSelector("a.post-block__title__link");
  // article_url = await page.$eval("a.post-block__title__link", elm => elm.getAttribute("href"));
  article_url = await page.evaluate("document.querySelector('a.post-block__title__link').getAttribute('href')");
  await page.goto("https://techcrunch.com" + article_url);
  await page.pdf({path: "tech_articles.pdf", format: "A4"});
  // page.click("a.post-block__title__link");
})();
