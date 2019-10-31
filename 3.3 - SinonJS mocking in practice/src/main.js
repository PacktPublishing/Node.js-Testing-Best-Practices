const axios = require("axios");

function doSomething(callback) {
  callback(5);
}

class Fruit {
  constructor() {
    this.fruitUrl =
      "https://raw.githubusercontent.com/amitbet/fruits/master/fruit.json";
    this.myShape = "";
    this.myRotation = 15;
  }

  async getFruitFromList(numFruit) {
    const response = await axios.get(this.fruitUrl);
    const json = response.data;
    return json.fruits[numFruit];
  }

  setShape(shapeType) {
    this.myShape = shapeType;
    return "this went ok!";
  }

  getShape() {
    return this.myShape;
  }

  setRotation(angle) {
    myRotation = angle;
  }
}

module.exports.doSomething = doSomething;
module.exports.Fruit = Fruit;
