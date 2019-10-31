let puppeteer = require("puppeteer");

async function main() {
  let browser = await puppeteer.launch({
    headless: true
  });
  let page = await browser.newPage();
  await page.goto("https://old.reddit.com/r/csharp/");
  await page.waitForSelector(".thing");
  let things = await page.$$(".thing");

  console.log("got %d topics", things.length);
  for (let i = 0; i < things.length; i++) {
    // await page.goto("https://export.shopify.com");
    // await page.waitForSelector(".section");
    // let sections = page.$$("section");
    let thing = things[i];

    let topic = await thing.$("a.title");
    let topicTitle = await page.evaluate(topic => topic.innerText, topic);
    console.log("topic #" + i + " :" + topicTitle);
    // button.click();
    // await page.waitForSelector("#ExpertResutls");
    // const lis = await page.$$("#ExpertResutls > li");
    // for (let li of lis) {
    //     let name = await li.$eval('h2', h2 => h2.innerText);
    //     console.log("name", name);
    // }
  }
}

main();
