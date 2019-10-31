const chai = require("chai");
const expect = chai.expect;  // Using Expect style
const makeIceCream = require("../src/main").makeIceCream;
const Wallet = require("../src/main").Wallet;

describe("mocking importance", async function () {
	it("should show why we need to mock some functions", async function () {
		let wallet = new Wallet(10);

		makeIceCream("Vanilla");
		makeIceCream("Chocolate");
		makeIceCream("Chocolate");
		let ok = wallet.chargePrepaidAccount(3, 2.75);

		expect(ok, "charge should end with success").to.be.true;
		// we should assert wallet.chargeAccountForCone called 3 times
		// we should also prevent calls to the actual payment system
	});

	it("should fail to charge wallet when insufficient funds", async function () {
		let wallet = new Wallet(10);

		makeIceCream("Vanilla");
		makeIceCream("Vanilla");
		makeIceCream("Chocolate");
		let ok = wallet.chargePrepaidAccount(3, 3.75);

		expect(ok, "charge should end with success").to.be.false;
		//check transaction rollback behavior
	});

});