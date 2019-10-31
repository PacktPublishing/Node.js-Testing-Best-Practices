const expect = require("chai").expect;
const chai = require("chai");
const axios = require("axios");
const nock = require("nock");
const sinon = require("sinon");
const chaiSinon = require("chai-sinon");
const code = require("../src/main");
chai.use(chaiSinon);

var targetServerUrl = "https://raw.githubusercontent.com";
after(async function() {
  nock.cleanAll();
});

describe("API test mocking", async function() {
  it("test sinon stub.resolves", async function() {
    let fruitUrl = targetServerUrl + "/amitbet/fruits/master/fruit.json";
    let fruit = new code.Fruit(fruitUrl);

    let myStub = sinon
      .stub(axios, "get")
      .resolves({
        data: {
          fruits: ["0", "1", "2", "3", "orange", "guava"]
        }
      })
      .withArgs(fruitUrl);

    let retVal = await fruit.getFruitFromList(5);
    expect(retVal).to.equal("guava");

    axios.get.restore();
  });

  it("test nock API replacement ", async function() {
    let fruitUrl = targetServerUrl + "/amitbet/fruits/master/fruit.json";

    let fruit = new code.Fruit(fruitUrl);

    nock("https://raw.githubusercontent.com/")
      .get("/amitbet/fruits/master/fruit.json")
      .reply(200, { fruits: ["0", "1", "2", "3", "orange", "guava"] });

    let retVal = await fruit.getFruitFromList(5);
    expect(retVal).to.equal("guava");

    nock.restore();
  });

  it("test with an external server (using json-server)", async () => {
    targetServerUrl = "http://localhost:3000";
    let fruitUrl = targetServerUrl + "/amitbet/fruits/master/fruit.json";
    let fruit = new code.Fruit(fruitUrl);
    let retVal = await fruit.getFruitFromList(5);
    expect(retVal).to.equal("guava");
  });
});
