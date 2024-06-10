const request = require("supertest");
const app = require("../../src/app");

describe("POST /v1/fragments", () => {
  test("unauthenticated requests are denied", () =>
    request(app).post("/v1/fragments").expect(401));

  test("incorrect credentials are denied", () =>
    request(app)
      .post("/v1/fragments")
      .auth("invalid@email.com", "incorrect_password")
      .expect(401));

  test("authenticated users can create a plain text fragment", async () => {
    const fragmentData = "Hello World";
    const fragmentDataBuffer = Buffer.from(fragmentData);

    const res = await request(app)
      .post("/v1/fragments")
      .auth("user1@email.com", "password1")
      .set("Content-Type", "text/plain")
      .send(fragmentDataBuffer);
    expect(res.status).toEqual(201);
    expect(res.body.status).toBe("ok");

    const fragment = res.body.fragment;
    expect(fragment).toHaveProperty("id");
    expect(fragment).toHaveProperty("created");
    expect(fragment).toHaveProperty("type");
    expect(fragment.type).toBe("text/plain");
    expect(fragment.ownerId).toBe("test");
    expect(fragment).toHaveProperty("size");
    expect(fragment.size).toBe(fragmentData.length);

    expect(res.headers.location).toBeDefined();

    // const fragmentId = res.body.fragment.id;
    // console.log(fragmentId);

    // const res2 = await request(app).get(`/v1/fragments/${fragmentId}`).auth('user1@email.com', 'password1');
    // expect(res2.statusCode).toBe(200);
    // expect(res2.body.data).toBe(fragmentData);
  });

  test("create a fragment with an unsupported type throw errors", async () => {
    const unsupportedType = "image/png";

    const res = await request(app)
      .post("/v1/fragments")
      .auth("user1@email.com", "password1")
      .set("Content-Type", unsupportedType)
      .send("testing");
    expect(res.status).toEqual(400);
    expect(res.body.error.message).toContain("Unsupported Content Type");
  });
});
