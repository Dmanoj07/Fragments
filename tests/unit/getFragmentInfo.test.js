const request = require("supertest");
const app = require("../../src/app");
const { Fragment } = require("../../src/model/fragment");

describe("GET /v1/fragments/:id/info", () => {
  test("unauthenticated requests are denied", () => {
    return request(app).get("/v1/fragments/1234/info").expect(401);
  });

  test("incorrect credentials are denied", () => {
    return request(app)
      .get("/v1/fragments/1234/info")
      .auth("invalid@email.com", "incorrect_password")
      .expect(401);
  });

  test("authenticated users get fragment info", async () => {
    const mockFragment = {
      id: "1234",
      ownerId: "user1@email.com",
      created: "2023-05-30T12:00:00Z",
      updated: "2023-05-30T12:00:00Z",
      type: "text/plain",
      size: 11,
    };

    jest.spyOn(Fragment, "byId").mockResolvedValue(mockFragment);

    const res = await request(app)
      .get("/v1/fragments/1234/info")
      .auth("user1@email.com", "password1");

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.fragment).toEqual(mockFragment);
  });

  test("returns 404 for non-existent fragment", async () => {
    jest.spyOn(Fragment, "byId").mockResolvedValue(null);

    const res = await request(app)
      .get("/v1/fragments/non-existent/info")
      .auth("user1@email.com", "password1");

    expect(res.statusCode).toBe(404);
  });
});
