const expect = require("chai").expect; // Using Expect style
const chai = require("chai");
const sinon = require("sinon");
const chaiSinon = require("chai-sinon");
const code = require("../src/main");
const axios = require("axios");

chai.use(chaiSinon);

describe("sinon spy tests", async function() {
  it("test sinon anonymous spy", async function() {
    let myCallback = sinon.spy();
    code.doSomething(myCallback);

    expect(myCallback).to.have.been.calledOnce;
    expect(myCallback).to.have.been.calledWith(5);
    code.doSomething(myCallback);
    expect(myCallback).to.have.been.calledTwice;

    code.doSomething(myCallback);
    expect(myCallback).to.have.been.calledThrice;

    //lets run it 7 more times to complete 10 calls
    for (let i = 3; i < 10; i++) {
      code.doSomething(myCallback);
    }
    expect(myCallback).to.have.callCount(10);
  });

  it("test sinon function spies", function() {
    let fruit = new code.Fruit();
    let anotherSpy = sinon.spy();
    let setShapeSpy = sinon.spy(fruit, "setShape");
    let setRotationSpy = sinon.spy(fruit, "setRotation");
    try {
      retVal = fruit.setShape("round");
      expect(setShapeSpy).to.have.been.calledOnce;
      expect(setShapeSpy).to.have.been.calledWith("round");
      expect(setShapeSpy).to.have.been.calledOn(fruit);
      expect(setShapeSpy).to.have.been.calledBefore(setRotationSpy);
      expect(setShapeSpy).to.have.returned("this went ok!");
    } finally {
      setRotationSpy.restore();
      setShapeSpy.restore();
    }
  });
});

describe("sinon stub tests", async function() {
  it("test sinon stub.resolves", async function() {
    let fruit = new code.Fruit();

    // every request will now return our promise... there is a better way to do this with nock.
    let fruitUrl =
      "https://raw.githubusercontent.com/amitbet/fruits/master/fruit.json";

    let myStub = sinon
      .stub(axios, "get")
      .withArgs(fruitUrl)
      .resolves({
        data: {
          fruits: ["0", "1", "2", "3", "orange", "apple"]
        }
      });

    let retVal = await fruit.getFruitFromList(5);
    expect(myStub).to.have.been.calledOnce;
    expect(retVal).to.equal("apple");

    // important to restore, stub.restore doesn't exist when using resolves in this sinon version
    axios.get.restore();
  });

  it("test sinon stub.returns", async function() {
    let fruit = new code.Fruit();
    let stub = sinon.stub(fruit, "getShape");
    stub.returns("square");

    let gotShape = fruit.getShape();
    expect(gotShape).to.equal("square");

    stub.restore();
  });
});

describe("sinon mock tests", async function() {
  it("test sinon mock", async function() {
    let fruit = new code.Fruit();
    let myMock = sinon.mock(fruit);
    // expect between 2 to 4 calls to setShape
    myMock
      .expects("setShape")
      .atLeast(2)
      .atMost(4);
    // make sure one of these calls gets "roundish" as a parameter
    myMock
      .expects("setShape")
      .once()
      .on(fruit)
      .withArgs("roundish");
    // replace the first call to getShape to return "roundish"
    myMock
      .expects("getShape")
      .once()
      .returns("roundish");
    myMock.expects("getFruitFromList").never();

    fruit.setShape("smooth");
    fruit.setShape("wrinkled");
    fruit.setShape("roundish");

    let lastShape = fruit.getShape();

    // check that our mock performed as expected, and returned "roundish"
    expect(lastShape).to.equal("roundish");

    //now verify all the expectations we defined:
    myMock.verify();
    myMock.restore();
  });
});
