const puppeteer = require("puppeteer");
const chalk = require("chalk")
const fs = require('fs');

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
  page.once('load', () => console.log('✅ Main website is loaded\n'));
  const article_url = await page.evaluate("document.querySelector('a.post-block__title__link').getAttribute('href')");

  await page.goto("https://techcrunch.com" + article_url);

  // extracts the author's name
  const article_author = await page.evaluate("document.querySelector('div.article__byline a').innerText");
  // extracts the author's twitter link
  const article_author_twitter = await page.evaluate("document.querySelector('span.article__byline__meta a').getAttribute('href')");
  // extracts the article's date
  const article_date = await page.evaluate("document.querySelector('time.full-date-time').innerText");
  // extracts the article's content
  const article_text = await page.evaluate("document.querySelector('div.article-content').innerText");
  // extracts the article's featured picture's link
  const article_featured_image_src = await page.evaluate("document.querySelector('img.article__featured-image').getAttribute('src')");

  fs.writeFile("generated_files\\featured_image_png", article_featured_image_src)
  
  console.log(article_author);
  console.log(article_date);
  console.log(article_author_twitter);
  console.log(article_featured_image_src);

  await page.pdf({path: "generated_files\\tech_articles.pdf", format: "A4"});
  await browser.close();
  console.log(error("Browser Closed"));
})();
