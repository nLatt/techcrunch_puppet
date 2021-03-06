const puppeteer = require("puppeteer");
const chalk = require("chalk")
const fs = require('fs');

const error = chalk.bold.red;
const success = chalk.bold.green;

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
  page.once('load', () => console.log(success('> ✅ Main website is loaded\n')));
  const article_url = await page.evaluate("document.querySelector('a.post-block__title__link').getAttribute('href')");

  await page.goto("https://techcrunch.com" + article_url);

  await page.pdf({path: "generated_files\\tech_articles.pdf", format: "A4"});

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

  var article_data_grouped = {
    "author": article_author,
    "author_twitter": article_author_twitter,
    "article_date": article_date,
    "article_text": article_text,
    "article_featured_image_src": article_featured_image_src
  }

  // saves featured image as .png
  var viewSource = await page.goto(article_featured_image_src);

  fs.writeFile("generated_files\\featured_image.png", await viewSource.buffer(), function (err) {
    if (err) {
      return console.log(error("> Error writing file.", err));
    } else {
      return console.log(success("> Success writing file."));
    }
  });

  // Writes grouped data to .json
  const article_data_grouped_string = JSON.stringify(article_data_grouped);

  fs.writeFile("generated_files\\article_data_grouped.json", article_data_grouped_string, function (err) {
    if (err) {
      return console.log(error("> Error writing file.", err));
    } else {
      return console.log(success("> Success writing file."));
    }
  });

  await browser.close();
  console.log(error("\n> Browser Closed"));
})();
