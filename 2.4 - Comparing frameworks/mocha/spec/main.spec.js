const expect = require ("chai").expect;
  before(async ()=>{
    // runs before all tests in this block
	console.log("before all");
  });

  after(async ()=>{
    // runs after all tests in this block
	console.log("after all");
  });

  beforeEach(async ()=>{
    // runs before each test in this block
	console.log("before each");
  });

  afterEach(async ()=>{
    // runs after each test in this block
	console.log("after each");
  });

  
describe("dummy test",()=>{
	it("should return false",async ()=>{
		expect(false,"the value should be false").to.be.false;
	});	
	it("should return true", async ()=>{
		 expect(true,"the value should be true").to.be.true;
	});
});