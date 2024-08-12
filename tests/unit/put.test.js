// tests/unit/put.test.js
const request = require("supertest");
const app = require("../../src/app");
const { Fragment } = require("../../src/model/fragment");

describe("PUT /v1/fragments/:id", () => {
  test("unauthenticated requests are denied", () =>
    request(app).put("/v1/fragments/1234").expect(401));

  test("returns 404 for non-existent fragments", async () => {
    jest.spyOn(Fragment, "byId").mockResolvedValue(null);

    const res = await request(app)
      .put("/v1/fragments/non-existent-id")
      .auth("user1@email.com", "password1")
      .set("Content-Type", "text/plain")
      .send("Updated text");

    expect(res.statusCode).toBe(404);
  });

  test("returns 400 when trying to change fragment type", async () => {
    const mockFragment = {
      id: "1234",
      ownerId: "user1@email.com",
      type: "text/plain",
      size: 11,
      getData: jest.fn().mockResolvedValue("Hello World"),
      setData: jest.fn(),
      save: jest.fn(),
    };

    jest.spyOn(Fragment, "byId").mockResolvedValue(mockFragment);

    const res = await request(app)
      .put("/v1/fragments/1234")
      .auth("user1@email.com", "password1")
      .set("Content-Type", "application/json")
      .send(JSON.stringify({ key: "value" }));

    expect(res.statusCode).toBe(400);
  });

  test("authenticated users can update their fragments", async () => {
    const mockFragment = {
      id: "1234",
      ownerId: "user1@email.com",
      type: "text/plain",
      size: 11,
      getData: jest.fn().mockResolvedValue("Hello World"),
      setData: jest.fn(),
      save: jest.fn(),
    };

    jest.spyOn(Fragment, "byId").mockResolvedValue(mockFragment);

    const res = await request(app)
      .put("/v1/fragments/1234")
      .auth("user1@email.com", "password1")
      .set("Content-Type", "text/plain")
      .send("Updated text");

    expect(res.statusCode).toBe(200);
    expect(mockFragment.setData).toHaveBeenCalledWith(
      Buffer.from("Updated text")
    );
    expect(mockFragment.save).toHaveBeenCalled();
  });
});
