const request = require("supertest");
const app = require("../../src/app");
const { Fragment } = require("../../src/model/fragment");

describe("GET /v1/fragments/:id", () => {
  test("unauthenticated requests are denied", () => {
    return request(app).get("/v1/fragments/1234").expect(401);
  });

  test("incorrect credentials are denied", () => {
    return request(app)
      .get("/v1/fragments/1234")
      .auth("invalid@email.com", "incorrect_password")
      .expect(401);
  });

  test("authenticated users get a fragment by id", async () => {
    const mockFragment = {
      id: "1234",
      ownerId: "user1@email.com",
      created: "2023-05-30T12:00:00Z",
      updated: "2023-05-30T12:00:00Z",
      type: "text/plain",
      size: 11,
      getData: jest.fn().mockResolvedValue(Buffer.from("Hello World")),
    };

    jest.spyOn(Fragment, "byId").mockResolvedValue(mockFragment);

    const res = await request(app)
      .get("/v1/fragments/1234")
      .auth("user1@email.com", "password1");

    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toBe("text/plain");
    expect(res.text).toBe("Hello World");
  });

  test("returns 404 for non-existent fragment", async () => {
    jest.spyOn(Fragment, "byId").mockResolvedValue(null);

    const res = await request(app)
      .get("/v1/fragments/non-existent")
      .auth("user1@email.com", "password1");

    expect(res.statusCode).toBe(404);
  });

  test("returns fragment data for existing fragment", async () => {
    const mockFragment = {
      id: "fragment1",
      ownerId: "user1@email.com",
      type: "text/plain",
      size: 11,
      getData: jest.fn().mockResolvedValue("Hello World"),
    };
    jest.spyOn(Fragment, "byId").mockResolvedValue(mockFragment);

    const res = await request(app)
      .get("/v1/fragments/fragment1")
      .auth("user1@email.com", "password1");

    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toContain("text/plain");
    expect(res.text).toBe("Hello World");
  });

  test("converts markdown to HTML when .html extension is used", async () => {
    const mockFragment = {
      id: "fragment1",
      ownerId: "user1@email.com",
      type: "text/markdown",
      size: 11,
      getData: jest.fn().mockResolvedValue("# Hello World"),
    };
    jest.spyOn(Fragment, "byId").mockResolvedValue(mockFragment);

    const res = await request(app)
      .get("/v1/fragments/fragment1.html")
      .auth("user1@email.com", "password1");

    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toContain("text/html");
    expect(res.text).toContain("<h1>Hello World</h1>");
  });

  test("returns 415 for unsupported conversion", async () => {
    const mockFragment = {
      id: "fragment1",
      ownerId: "user1@email.com",
      type: "text/plain",
      size: 11,
      getData: jest.fn().mockResolvedValue("Hello World"),
    };
    jest.spyOn(Fragment, "byId").mockResolvedValue(mockFragment);

    const res = await request(app)
      .get("/v1/fragments/fragment1.png")
      .auth("user1@email.com", "password1");

    expect(res.statusCode).toBe(415);
  });
});
