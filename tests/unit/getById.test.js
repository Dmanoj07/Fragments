const request = require("supertest");
const app = require("../../src/app");
const logger = require("../../src/logger"); // Import the logger module

describe("GET /v1/fragments/:id", () => {
  test("unauthenticated requests are denied", () => {
    logger.info("Testing unauthenticated requests...");
    return request(app).get("/v1/fragments/:id").expect(401);
  });

  test("incorrect credentials are denied", () => {
    logger.info("Testing incorrect credentials...");
    return request(app)
      .get("/v1/fragments/:id")
      .auth("invalid@email.com", "incorrect_password")
      .expect(401);
  });

  // test("authenticated users get a fragment by id", async () => {
  //   const fragmentData = "Hello World";
  //   const fragmentDataBuffer = Buffer.from(fragmentData);

  //   const resPost = await request(app)
  //     .post("/v1/fragments")
  //     .auth("user1@email.com", "password1")
  //     .set("Content-Type", "text/plain")
  //     .send(fragmentDataBuffer);
  //   expect(resPost.status).toEqual(201);

  //   const createdId = resPost.body.fragment.id;

  //   const resGet = await request(app)
  //     .get(`/v1/fragments/${createdId}`)
  //     .auth("user1@email.com", "password1");
  //   expect(resGet.statusCode).toBe(200);

  //   // Log the response for debugging purposes
  //   logger.info("Response for authenticated users:", resGet.body);
  // });
});
