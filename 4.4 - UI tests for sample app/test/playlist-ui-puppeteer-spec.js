const puppeteer = require("puppeteer");
const expect = require("chai").expect;

describe("Song List Editor in chrome (Puppeteer)", async function() {
  let browser = null;
  before(async function() {
    try {
      browser = await puppeteer.launch({
        headless: false
      });
    } catch (err) {
      console.log(err);
    }
  });

  after(async () => {
    browser.close();
  });

  it("should add a song to an existing list", async function() {
    let page = await browser.newPage();
    await page.goto("localhost:3001/");
    let searchBox = await page.$(".autocomplete");
    console.log(searchBox);
    await searchBox.click();
    await searchBox.type("ala");
    await page.keyboard.press("ArrowDown");
    await page.waitFor(300);
    await page.keyboard.press("Enter");
    await page.keyboard.press("Tab");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");

    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");

    let addSongButton = await page.$("#addSongButton");
    await addSongButton.click();

    //allow some time for page to refresh with updated data
    await page.waitFor(100);
    var text = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll(".card-text"),
        element => element.textContent
      )
    );
    console.log("text = " + text);
    expect(text[text.length - 1].trim()).to.eq("Ironic / Alanis");
    // await page.waitFor(3000);
  });
});
