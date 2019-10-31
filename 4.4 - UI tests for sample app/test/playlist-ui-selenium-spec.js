const { Builder, By, Key, until } = require("selenium-webdriver");
const expect = require("chai").expect;

async function getTextNode(webEl) {
  let text = await webEl.getText();
  return text.split("\n");
}

async function testAddSongToList(driver, searchStr, expectedStr) {
  await driver.get("http://localhost:3001/");

  await driver.wait(until.titleIs("demo"));

  let searchBox = await driver.findElement(By.className("autocomplete"));
  await searchBox.click();

  await driver
    .actions()
    .sendKeys(searchStr)
    .sendKeys(Key.ARROW_DOWN, Key.ARROW_DOWN)
    .perform();

  await driver
    .actions()
    .move({ duration: 500, origin: searchBox, x: 0, y: 20 })
    .click()
    .perform();

  let listPicker = await driver.findElement(By.id("pickListCombo"));
  await listPicker.click();
  // await listPicker.keyDown();
  await listPicker.sendKeys("u");
  await listPicker.sendKeys(Key.ENTER);

  let addSongButton = await driver.findElement(By.id("addSongButton"));
  console.log(addSongButton);
  await addSongButton.click();

  let elems = await driver.findElements(By.className("card-body"));
  let text = await getTextNode(elems[1]);

  expect(text[text.length - 2]).to.contain(expectedStr);
}
describe("Song List Editor in chrome (Selenium)", async function() {
  let driver = null;
  this.timeout(50000);
  before(async function() {
    driver = await new Builder().forBrowser("chrome").build(); //internet explorer
  });

  it("should add a song to an existing list", async () => {
    return testAddSongToList(driver, "yeah", "Yeah! / Usher");
  });

  after(() => {
    driver.quit();
  });
});

describe("Song List Editor in firefox (Selenium)", async function() {
  let driver = null;
  this.timeout(50000);

  before(async function() {
    driver = new Builder().forBrowser("firefox").build();
  });

  after(() => {
    driver.quit();
  });

  it("should add a song to an existing list", async function() {
    return testAddSongToList(driver, "lit", "Lithium / Nirvana");
  });

  // it("should not add a song which doesn't exist in the system", async () => {});
});
