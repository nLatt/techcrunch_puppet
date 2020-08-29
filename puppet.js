const puppeteer = require("puppeteer");


(async () => {

  const website = "https://techcrunch.com/tag/series-a/"

  const browser = await puppeteer.launch({
    headless: true,
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
  const article_url = await page.evaluate("document.querySelector('a.post-block__title__link').getAttribute('href')");

  await page.goto("https://techcrunch.com" + article_url);
  // await page.waitForNavigation({ waitUntil: 'networkidle2' });
  // page.once('load', () => console.info('✅ Page is loaded'));
  await page.pdf({path: "peter.pdf"})

  // const article_text = await page.evaluate("document.querySelector(div.article-content).innerText");

  await browser.close();
  console.log("Browser Closed");
})();
