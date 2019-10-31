const chai = require("chai");
const assert = chai.assert;  // Using Assert style
const expect = chai.expect;  // Using Expect style
const should = chai.should;  // Using Should style
const makeIceCream = require("../src/main").makeIceCream;
should();  // Modifies `Object.prototype`



//chai plugins
const chaiHttp = require("chai-http");  // Using Should style
chai.use(chaiHttp);

describe("assertion style tests", async function () {
	let response = {
		status: 200,
		body: {
			deletionConfirmation: {
				name: "Big Hat",
				_id: 11
			}
		}
	}

	let opComplete = true;
	var numbers = [1, 2, 3, 4, 5];
	var numbers1 = [1, 2, 3, 4, 5];
	let myNullVar = null;

	// assert is less expressive, more programmatic
	// but tests should be very readable
	it("assert style", async function () {

		assert.isTrue(opComplete, "operation should be complete");
		assert.isArray(numbers, "numbers should be an array");
		assert.include(numbers, 2, "numbers should contain 2");
		assert.lengthOf(numbers, 5, "numbers should contains 5 numbers");
		assert.includeDeepOrderedMembers(numbers, [1, 2, 3]);

		assert.notEqual(numbers, numbers1); //shallow
		assert.deepStrictEqual(numbers, numbers1); // deep
	});

	// expect is very expressive, with most lines reading very naturally
	// it by far the most popular assertion format
	it("expect style", async function () {
		// an additional message can be provided to explain the error:
		expect(opComplete, "operation should be complete").to.be.true;

		// this is almost plain english:
		expect(numbers).to.be.an("array").of.length(5).that.includes(2);
		expect(numbers).to.have.lengthOf(5);

		//shallow vs. deep equality
		expect(numbers).not.to.equal(numbers1); //shallow - pointers not equal
		expect(numbers).to.deep.equal(numbers1); // deep
		expect(numbers).to.eql(numbers1); // deep
		expect(numbers).to.have.ordered.members([1, 2, 3, 4, 5]); //ordered members

		// testing an object:
		expect(response.status).to.equal(200);
		expect(response.body).to.be.an("object").with.property("deletionConfirmation");
		expect(response.body.deletionConfirmation)
			.to.be.an("object")
			.with.property("name")
			.that.equals("Big Hat");
	});

	// should style is very similar to expect, it is arguably even more natural than expect
	// but this comes at a cost of adding functions on the Object prototype
	// this may seldomely cause issues, which is the main reason for not using should.
	it("should style", async function () {
		opComplete.should.be.true;

		numbers.should.be.an("array").that.includes(2);
		numbers.should.have.lengthOf(5);

		//myVar.should.equal(null);

		response.status.should.equal(200);

		response.body.should.be.an("object");
		response.body.should.have.property("deletionConfirmation");
		response.body.deletionConfirmation.should.be.an("object").with.property("name").that.equals("Big Hat");
		// response.body.deletionConfirmation.should.have.property("name");
		// response.body.deletionConfirmation.should.have.property("_id");
		// response.body.deletionConfirmation.name.should.equal("Big Hat");
	});

	//assertion readability: bad example 
	it("sad path is hard to understand", async () => {
		let myError;
		let result;
		try {
			result = makeIceCream("Janilla");
		}
		catch (error) {
			assert.equal(error, "invalid flavor");
			myError = error;
		}
		assert.isNotNull(myError);

		//one-liner alternatives:
		assert.throws(makeIceCream.bind(null, "Janilla"), "invalid flavor");
		expect(makeIceCream.bind(null, "Janilla")).to.throw("invalid flavor");
		makeIceCream.bind(null, "Janilla").should.throw("invalid flavor");
	});


	//chai plugins
	it('test chai http plugin', async function () {   // <= No done callback
		let res = await chai.request("https://www.boredapi.com/api/activity")
			.get('/');

		expect(res.body, "got error: " + res.body.error).to.not.have.property("error");
		expect(res).to.have.status(200);
		expect(res.body).to.be.an("object");
		expect(res.body).to.have.property("activity").that.is.a.string;
		expect(res.body.activity).to.be.a.string;
		expect(res.body.participants).to.eql(1);
	});
});