const expect = require ("chai").expect;

describe("dummy test",()=>{
	it("should return false", async ()=>{
		expect(false,"the value should be false").to.be.false;
	});	
	it("should return true", async ()=>{
		 expect(true,"the value should be true").to.be.true;
	});
});