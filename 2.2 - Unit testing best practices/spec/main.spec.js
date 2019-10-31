const chai = require ("chai");
  //ex4: using variables
  let counter;
  
  //ex2: using hooks (before and after for initializations)
  before(async function(){
	counter = 0;
    // runs before all tests in this block
	console.log("-----before all-----");
  });

  after(async function(){
    // runs after all tests in this block
	console.log("-----after all-----");
  });

  beforeEach(async function(){
    // runs before each test in this block
	console.log("before each");
  });

  afterEach(async function(){
    // runs after each test in this block
	console.log("after each");
  });

//ex1: 
// a. multiDecribe-it-assertion testing,
// b. importance of text and standard patterns of describe, it and expect messages
// b. using async await for testing
// c. using functions, not arrow functions =>, so you can access "this" for mocha context
// d. tests shold be readable and maintainable, looking around for reusable value definitions or jumping around the code for contants which can be good for code, is bad for testing code 
// d. helper functions: try to keep most logic in the test, here duplication can be ok. Long logic can be separated out, but try to keep the test compact and local 
// e. test only public APIs not private functions, testing publics ensures your component performs as expected, why put constraints on how it gets there?
// e. BDD tells us to use product doc definintions as our test cases, this makes sure we test for public functionality.
describe("dummy test",async function(){
	
	it("should return false",async function(){
		chai.expect(false,"the value should be false").to.be.false;
	});	
	it("should return true", async function(){
		 chai.expect(true,"the value should be true").to.be.true;
	});
	
	//ex4: using retries
	it("counter should eventually reach 3", async function(){
		this.retries(4);
		console.log(counter);
		++counter;
		chai.expect(counter,"couter should be 3").to.equal(3);
	});
	//ex3: skipping
	it.skip("should be skipped", async function(){
		 chai.expect(true,"the value should be true").to.be.true;
	});
});