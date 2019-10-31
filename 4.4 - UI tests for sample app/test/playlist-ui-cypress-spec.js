// const puppeteer = require("puppeteer");
// const expect = require("chai").expect;

// describe("Song List Editor in chrome (Puppeteer)", async function() {
//   let browser = null;
//   this.timeout(50000);
//   before(async function() {
//     try {
//       browser = await puppeteer.launch({
//         headless: false
//       });
//     } catch (err) {
//       console.log(err);
//     }
//   });
//   after(async () => {
//     browser.close();
//   });
//   it("should add a song to an existing list", async function() {
//     let page = await browser.newPage();
//     await page.goto("http://www.google.com/ncr");
//     await page.keyboard.type("puppeteer");
//     await page.keyboard.press("Enter");

//     // Wait for redirection
//     await page.waitForNavigation({ waitUntil: "networkidle2" });
//     const pageTitle = await page.title();
//     console.log(pageTitle);
//     expect(pageTitle).to.equal("puppeteer - Google Search");
//   });

//   after(() => {
//     browser.quit();
//   });
// });
