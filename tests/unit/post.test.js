// const request = require("supertest");
// const app = require("../../src/app");
// const logger = require("../../src/logger"); // Import the logger module

// describe("POST /v1/fragments", () => {
//   test("unauthenticated requests are denied", () => {
//     logger.info("Testing unauthenticated requests...");
//     return request(app).post("/v1/fragments").expect(401);
//   });

//   test("incorrect credentials are denied", () => {
//     logger.info("Testing incorrect credentials...");
//     return request(app)
//       .post("/v1/fragments")
//       .auth("invalid@email.com", "incorrect_password")
//       .expect(401);
//   });

//   test("authenticated users can create a plain text fragment", async () => {
//     const fragmentData = "Hello World";
//     const fragmentDataBuffer = Buffer.from(fragmentData);

//     const res = await request(app)
//       .post("/v1/fragments")
//       .auth("user1@email.com", "password1")
//       .set("Content-Type", "text/plain")
//       .send(fragmentDataBuffer);
//     expect(res.status).toEqual(201);
//     expect(res.body.status).toBe("ok");

//     const fragment = res.body.fragment;
//     expect(fragment).toHaveProperty("id");
//     expect(fragment).toHaveProperty("created");
//     expect(fragment).toHaveProperty("type");
//     expect(fragment.type).toBe("text/plain");
//     // expect(fragment.ownerId).toBe("test");
//     expect(fragment).toHaveProperty("size");
//     expect(fragment.size).toBe(fragmentData.length);

//     expect(res.headers.location).toBeDefined();
//   });

//   test("create a fragment with an unsupported type throws errors", async () => {
//     const unsupportedType = "image/png";

//     const res = await request(app)
//       .post("/v1/fragments")
//       .auth("user1@email.com", "password1")
//       .set("Content-Type", unsupportedType)
//       .send("testing");
//     expect(res.status).toEqual(400);
//     expect(res.body.error.message).toContain("Unsupported Content Type");
//   });
// });

const request = require("supertest");
const app = require("../../src/app");
const logger = require("../../src/logger");

describe("POST /v1/fragments", () => {
  test("unauthenticated requests are denied", () => {
    logger.info("Testing unauthenticated requests...");
    return request(app).post("/v1/fragments").expect(401);
  });

  test("incorrect credentials are denied", () => {
    logger.info("Testing incorrect credentials...");
    return request(app)
      .post("/v1/fragments")
      .auth("invalid@email.com", "incorrect_password")
      .expect(401);
  });

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
    expect(fragment).toHaveProperty("size");
    expect(fragment.size).toBe(fragmentData.length);

    expect(res.headers.location).toBeDefined();
  });

  test("authenticated users can create a JSON fragment", async () => {
    const fragmentData = JSON.stringify({ key: "value" });
    const fragmentDataBuffer = Buffer.from(fragmentData, "utf-8");
    const fragmentSize = Buffer.byteLength(fragmentDataBuffer);

    const res = await request(app)
      .post("/v1/fragments")
      .auth("user1@email.com", "password1")
      .set("Content-Type", "application/json")
      .send(fragmentData);
    console.log(fragmentDataBuffer);
    expect(res.status).toEqual(201);
    expect(res.body.status).toBe("ok");
    expect(res.body.fragment.type).toBe("application/json");
    console.log(fragmentSize);
    // Adjust this expectation to match the actual buffer length received
    expect(res.body.fragment.size).toBe(fragmentSize); // Should be 80 bytes

    expect(res.headers.location).toBeDefined();
  });

  test("create a fragment with an unsupported type throws errors", async () => {
    const unsupportedType = "image/png";

    const res = await request(app)
      .post("/v1/fragments")
      .auth("user1@email.com", "password1")
      .set("Content-Type", unsupportedType)
      .send("testing");
    expect(res.status).toEqual(400);
    expect(res.body.error.message).toContain("Unsupported Content Type");
  });

  // test("fragment exceeding size limit is rejected", async () => {
  //   const largeData = Buffer.alloc(6 * 1024 * 1024); // 6MB, exceeding 5MB limit

  //   const res = await request(app)
  //     .post("/v1/fragments")
  //     .auth("user1@email.com", "password1")
  //     .set("Content-Type", "text/plain")
  //     .send(largeData);

  //   expect(res.status).toEqual(413); // Payload Too Large
  // });

  test("empty fragment body is rejected", async () => {
    const res = await request(app)
      .post("/v1/fragments")
      .auth("user1@email.com", "password1")
      .set("Content-Type", "text/plain")
      .send();

    expect(res.status).toEqual(400);
    expect(res.body.error.message).toContain("Empty fragment body");
  });
});
