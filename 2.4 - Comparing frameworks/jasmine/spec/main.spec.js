

beforeAll(async ()=>{
    console.log("before all");
});

beforeEach(async ()=>{
    console.log("before each");
});

afterEach(async ()=>{
    console.log("after each")
});

afterAll(async ()=>{
    console.log("after all");
});

describe("dummy test",()=>{
	it("should return false",async ()=>{
		expect(false).toBe(false);
	});	
	it("should return true", async ()=>{
		expect(true).toBe(true);
	});
});