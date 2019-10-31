const chai = require ("chai");

describe("dummy test",()=>{
	it("should return false",async ()=>{
		chai.expect(false,"the value should be false").to.be.false;
	});	
	it("should return true", async ()=>{
		 chai.expect(true,"the value should be true").to.be.true;
	});
});