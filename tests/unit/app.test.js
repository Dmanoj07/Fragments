const request = require("supertest");
const app = require("../../src/app"); // Adjust the path as needed

describe("404 handler", () => {
  test("should return 404 for non-existent routes", async () => {
    const response = await request(app).get("/non-existent-route");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: "error",
      error: {
        message: "not found",
        code: 404,
      },
    });
  });
});
