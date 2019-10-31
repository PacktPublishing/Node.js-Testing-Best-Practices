const axios = require("axios");

class Fruit {
  constructor(fruitUrl) {
    this.fruitUrl = fruitUrl;
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

module.exports.Fruit = Fruit;
