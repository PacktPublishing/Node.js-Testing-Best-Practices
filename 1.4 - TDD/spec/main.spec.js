const expect = require("chai").expect;
const User = require("../src/main.js").User;

describe("dummy test", () => {
	it("email can be set", async () => {
		let user = new User();
		user.setEmail("amit@gmail.com");
		expect(user.email).to.equal("amit@gmail.com");
	});

	it("email will not be set if its format is bad", async () => {
		let user = new User();
		user.setEmail("amitgmail.com");
		expect(user.email).to.be.undefined;
	});

});