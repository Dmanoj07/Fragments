// tests/integration/delete-fragments.test.js

const request = require("supertest");
const app = require("../../src/app");

describe("DELETE /v1/fragments/:id", () => {
  let fragmentId;

  beforeEach(async () => {
    // Create a fragment to delete
    const res = await request(app)
      .post("/v1/fragments")
      .auth("user1@email.com", "password1")
      .set("Content-Type", "text/plain")
      .send("Fragment to delete");
    fragmentId = res.body.fragment.id;
  });

  test("unauthenticated requests are denied", () =>
    request(app).delete(`/v1/fragments/${fragmentId}`).expect(401));

  test("authenticated users can delete their fragments", async () => {
    const res = await request(app)
      .delete(`/v1/fragments/${fragmentId}`)
      .auth("user1@email.com", "password1");

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");

    // Verify the fragment is deleted
    const getRes = await request(app)
      .get(`/v1/fragments/${fragmentId}`)
      .auth("user1@email.com", "password1");
    expect(getRes.statusCode).toBe(404);
  });

  test("returns 404 for non-existent fragments", async () => {
    const res = await request(app)
      .delete("/v1/fragments/non-existent-id-" + Date.now()) // Add timestamp to ensure uniqueness
      .auth("user1@email.com", "password1");

    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe("error");
    expect(res.body.error.message).toBe("Fragment not found");
  });
});
