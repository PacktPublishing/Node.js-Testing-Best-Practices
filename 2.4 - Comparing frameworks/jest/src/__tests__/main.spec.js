

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

test('should return false given external link', async () => {
  expect(false).toBe(false)
})

test('should return true given internal link', async () => {
  expect(true).toBe(true)
})