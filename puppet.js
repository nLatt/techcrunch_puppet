const puppeteer = require("puppeteer");
const chalk = require("chalk")

const error = chalk.bold.red;

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
  await page.once('load', () => console.log('✅ Main website is loaded'));
  const article_url = await page.evaluate("document.querySelector('a.post-block__title__link').getAttribute('href')");

  await page.goto("https://techcrunch.com" + article_url);
  await page.once('load', () => console.log('✅ First article is loaded'));

  const article_text = await page.evaluate("document.querySelector('div.article-content').innerText");
  console.log(article_text)

  await browser.close();
  console.log(error("Browser Closed"));
})();
