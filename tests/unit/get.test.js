// tests/unit/get.test.js

const request = require("supertest");

const app = require("../../src/app");
const { Fragment } = require("../../src/model/fragment");

describe("GET /v1/fragments", () => {
  // If the request is missing the Authorization header, it should be forbidden
  test("unauthenticated requests are denied", () =>
    request(app).get("/v1/fragments").expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test("incorrect credentials are denied", () =>
    request(app)
      .get("/v1/fragments")
      .auth("invalid@email.com", "incorrect_password")
      .expect(401));

  // Using a valid username/password pair should give a success result with a .fragments array
  test("authenticated users get a fragments array", async () => {
    const res = await request(app)
      .get("/v1/fragments")
      .auth("user1@email.com", "password1");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(Array.isArray(res.body.fragments)).toBe(true);
  });

  test("authenticated users get expanded fragments array with expand=1", async () => {
    // Mock the Fragment.findByUser method
    jest.spyOn(Fragment, "byUser").mockResolvedValue([
      {
        id: "fragment1",
        ownerId: "user1@email.com",
        created: "2021-11-02T15:09:50.403Z",
        updated: "2021-11-02T15:09:50.403Z",
        type: "text/plain",
        size: 256,
      },
    ]);

    const res = await request(app)
      .get("/v1/fragments?expand=1")
      .auth("user1@email.com", "password1");

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(Array.isArray(res.body.fragments)).toBe(true);
    expect(res.body.fragments[0]).toHaveProperty("id");
    expect(res.body.fragments[0]).toHaveProperty("ownerId");
    expect(res.body.fragments[0]).toHaveProperty("created");
    expect(res.body.fragments[0]).toHaveProperty("updated");
    expect(res.body.fragments[0]).toHaveProperty("type");
    expect(res.body.fragments[0]).toHaveProperty("size");
  });

  // TODO: we'll need to add tests to check the contents of the fragments array later
});
