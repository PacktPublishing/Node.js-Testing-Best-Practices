const jasmine = require('jasmine');

jasmine.describe("dummy test",()=>{
	jasmine.it("should return false",async ()=>{
		jasmine.expect(false).toBe(false);
	});	
	jasmine.it("should return true", async ()=>{
		jasmine.expect(true).toBe(true);
	});
});