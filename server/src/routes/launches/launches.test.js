const request = require("supertest");
const app = require("../../app");

describe("GET /launches", () => {
  it("should respond with 200 status", async () => {
    await request(app).get("/launches").expect(200);
  });
});
