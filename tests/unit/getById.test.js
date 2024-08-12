// const request = require("supertest");
// const app = require("../../src/app");
// const { Fragment } = require("../../src/model/fragment");

// describe("GET /v1/fragments/:id", () => {
//   test("unauthenticated requests are denied", () => {
//     return request(app).get("/v1/fragments/1234").expect(401);
//   });

//   test("incorrect credentials are denied", () => {
//     return request(app)
//       .get("/v1/fragments/1234")
//       .auth("invalid@email.com", "incorrect_password")
//       .expect(401);
//   });

//   test("authenticated users get a fragment by id", async () => {
//     const mockFragment = {
//       id: "1234",
//       ownerId: "user1@email.com",
//       created: "2023-05-30T12:00:00Z",
//       updated: "2023-05-30T12:00:00Z",
//       type: "text/plain",
//       size: 11,
//       getData: jest.fn().mockResolvedValue(Buffer.from("Hello World")),
//     };

//     jest.spyOn(Fragment, "byId").mockResolvedValue(mockFragment);

//     const res = await request(app)
//       .get("/v1/fragments/1234")
//       .auth("user1@email.com", "password1");

//     expect(res.statusCode).toBe(200);
//     expect(res.headers["content-type"]).toBe("text/plain");
//     expect(res.text).toBe("Hello World");
//   });

//   test("returns 404 for non-existent fragment", async () => {
//     jest.spyOn(Fragment, "byId").mockResolvedValue(null);

//     const res = await request(app)
//       .get("/v1/fragments/non-existent")
//       .auth("user1@email.com", "password1");

//     expect(res.statusCode).toBe(404);
//   });

//   test("returns fragment data for existing fragment", async () => {
//     const mockFragment = {
//       id: "fragment1",
//       ownerId: "user1@email.com",
//       type: "text/plain",
//       size: 11,
//       getData: jest.fn().mockResolvedValue("Hello World"),
//     };
//     jest.spyOn(Fragment, "byId").mockResolvedValue(mockFragment);

//     const res = await request(app)
//       .get("/v1/fragments/fragment1")
//       .auth("user1@email.com", "password1");

//     expect(res.statusCode).toBe(200);
//     expect(res.headers["content-type"]).toContain("text/plain");
//     expect(res.text).toBe("Hello World");
//   });

//   test("converts markdown to HTML when .html extension is used", async () => {
//     const mockFragment = {
//       id: "fragment1",
//       ownerId: "user1@email.com",
//       type: "text/markdown",
//       size: 11,
//       getData: jest.fn().mockResolvedValue("# Hello World"),
//     };
//     jest.spyOn(Fragment, "byId").mockResolvedValue(mockFragment);

//     const res = await request(app)
//       .get("/v1/fragments/fragment1.html")
//       .auth("user1@email.com", "password1");

//     expect(res.statusCode).toBe(200);
//     expect(res.headers["content-type"]).toContain("text/html");
//     expect(res.text).toContain("<h1>Hello World</h1>");
//   });

//   test("returns 415 for unsupported conversion", async () => {
//     const mockFragment = {
//       id: "fragment1",
//       ownerId: "user1@email.com",
//       type: "text/plain",
//       size: 11,
//       getData: jest.fn().mockResolvedValue("Hello World"),
//     };
//     jest.spyOn(Fragment, "byId").mockResolvedValue(mockFragment);

//     const res = await request(app)
//       .get("/v1/fragments/fragment1.png")
//       .auth("user1@email.com", "password1");

//     expect(res.statusCode).toBe(415);
//   });
//   //conversing text/markdown to text/html
//   test("test extension to converse markdown to html", async () => {
//     const fragmentData = "Testing";
//     const fragmentDataBuffer = Buffer.from(fragmentData);

//     const resPost = await request(app)
//       .post("/v1/fragments")
//       .auth("user1@email.com", "password1")
//       .set("Content-Type", "text/markdown")
//       .send(fragmentDataBuffer);
//     expect(resPost.status).toEqual(201);

//     const createdId = resPost.body.fragment.id;

//     const resGet = await request(app)
//       .get(`/v1/fragments/${encodeURIComponent(createdId)}.html`)
//       .auth("user1@email.com", "password1");
//     expect(resGet.statusCode).toBe(200);
//     expect(resGet.headers["content-type"]).toMatch(/^text\/html/);
//     expect(resGet.text).toContain("<p>Testing</p>");
//     //logger.info(resGet);
//   });

//   //invalid conversing between text/markdown and image/jpg
//   test("test extension for invalid conversing", async () => {
//     const fragmentData = "Testing";
//     const fragmentDataBuffer = Buffer.from(fragmentData);

//     const resPost = await request(app)
//       .post("/v1/fragments")
//       .auth("user1@email.com", "password1")
//       .set("Content-Type", "text/markdown")
//       .send(fragmentDataBuffer);
//     expect(resPost.status).toEqual(201);

//     const createdId = resPost.body.fragment.id;

//     const resGet = await request(app)
//       .get(`/v1/fragments/${encodeURIComponent(createdId)}.jpg`)
//       .auth("user1@email.com", "password1");
//     expect(resGet.statusCode).toBe(415);
//     //logger.info(resGet);
//   });

//   //invalid conversing between text/plain and image/png
//   test("No possible conversing between text/plain and image/png", async () => {
//     const fragmentData = "test";
//     const resPost = await request(app)
//       .post("/v1/fragments")
//       .auth("user1@email.com", "password1")
//       .set("Content-Type", "text/plain")
//       .send(fragmentData);
//     expect(resPost.status).toEqual(201);

//     const createdId = resPost.body.fragment.id;

//     const resGet = await request(app)
//       .get(`/v1/fragments/${encodeURIComponent(createdId)}.png`)
//       .auth("user1@email.com", "password1");
//     expect(resGet.statusCode).toBe(415);
//   });

//   //conversing text/plain to text/plain
//   test("test extension to converse text/plain to text/plain", async () => {
//     const fragmentData = "Testing";

//     const resPost = await request(app)
//       .post("/v1/fragments")
//       .auth("user1@email.com", "password1")
//       .set("Content-Type", "text/plain")
//       .send(fragmentData);
//     expect(resPost.status).toEqual(201);

//     const createdId = resPost.body.fragment.id;

//     const resGet = await request(app)
//       .get(`/v1/fragments/${encodeURIComponent(createdId)}.txt`)
//       .auth("user1@email.com", "password1");
//     expect(resGet.statusCode).toBe(200);
//     expect(resGet.headers["content-type"]).toBe("text/plain");
//     expect(resGet.text).toBe("Testing");
//   });

//   //conversing text/html to text/html
//   test("test extension to converse text/html to text/html", async () => {
//     const fragmentData = "<p>Testing</p>";

//     const resPost = await request(app)
//       .post("/v1/fragments")
//       .auth("user1@email.com", "password1")
//       .set("Content-Type", "text/html")
//       .send(fragmentData);
//     expect(resPost.status).toEqual(201);

//     const createdId = resPost.body.fragment.id;

//     const resGet = await request(app)
//       .get(`/v1/fragments/${encodeURIComponent(createdId)}.html`)
//       .auth("user1@email.com", "password1");
//     expect(resGet.statusCode).toBe(200);
//     expect(resGet.headers["content-type"]).toBe("text/html");
//     expect(resGet.text).toBe(fragmentData);
//   });

//   //conversing text/html to text/plain
//   test("test extension to converse text/html to text/plain", async () => {
//     const fragmentData = "<p>Testing</p>";

//     const resPost = await request(app)
//       .post("/v1/fragments")
//       .auth("user1@email.com", "password1")
//       .set("Content-Type", "text/html")
//       .send(fragmentData);
//     expect(resPost.status).toEqual(201);

//     const createdId = resPost.body.fragment.id;

//     const resGet = await request(app)
//       .get(`/v1/fragments/${encodeURIComponent(createdId)}.txt`)
//       .auth("user1@email.com", "password1");
//     expect(resGet.statusCode).toBe(200);
//     expect(resGet.headers["content-type"]).toMatch(/^text\/plain/);
//     expect(resGet.text).toBe("Testing");
//     logger.info(resGet.message);
//   });

//   //conversing text/csv to text/csv
//   test("test extension to converse text/csv to text/csv", async () => {
//     const fragmentData = "T,e,s,t\ni,n,g";

//     const resPost = await request(app)
//       .post("/v1/fragments")
//       .auth("user1@email.com", "password1")
//       .set("Content-Type", "text/csv")
//       .send(fragmentData);
//     expect(resPost.status).toEqual(201);

//     const createdId = resPost.body.fragment.id;

//     const resGet = await request(app)
//       .get(`/v1/fragments/${encodeURIComponent(createdId)}.csv`)
//       .auth("user1@email.com", "password1");
//     expect(resGet.statusCode).toBe(200);
//     expect(resGet.headers["content-type"]).toBe("text/csv");
//     expect(resGet.text).toBe(fragmentData);
//   });

//   //conversing text/csv to text/plain
//   test("test extension to converse text/csv to text/plain", async () => {
//     const fragmentData = "T,e,s,t\ni,n,g";

//     const resPost = await request(app)
//       .post("/v1/fragments")
//       .auth("user1@email.com", "password1")
//       .set("Content-Type", "text/csv")
//       .send(fragmentData);
//     expect(resPost.status).toEqual(201);

//     const createdId = resPost.body.fragment.id;

//     const resGet = await request(app)
//       .get(`/v1/fragments/${encodeURIComponent(createdId)}.txt`)
//       .auth("user1@email.com", "password1");
//     expect(resGet.statusCode).toBe(200);
//     expect(resGet.headers["content-type"]).toMatch(/^text\/plain/);
//     expect(resGet.text).toBe(fragmentData);
//   });

//   //conversing text/csv to application/json
//   test("test extension to converse text/csv to application/json", async () => {
//     const fragmentData = "name,age,city\nMichael,23,North York\nBob,25,Toronto";

//     const resPost = await request(app)
//       .post("/v1/fragments")
//       .auth("user1@email.com", "password1")
//       .set("Content-Type", "text/csv")
//       .send(fragmentData);
//     expect(resPost.status).toEqual(201);

//     const createdId = resPost.body.fragment.id;

//     const resGet = await request(app)
//       .get(`/v1/fragments/${encodeURIComponent(createdId)}.json`)
//       .auth("user1@email.com", "password1");
//     expect(resGet.statusCode).toBe(200);
//     expect(resGet.headers["content-type"]).toMatch(/^application\/json/);
//     const expectedJson = [
//       { name: "Michael", age: "23", city: "North York" },
//       { name: "Bob", age: "25", city: "Toronto" },
//     ];
//     expect(resGet.body).toEqual(expectedJson);
//   });

//   //conversing application/json to application/json
//   test("test extension to converse text/csv to application/json", async () => {
//     const fragmentData = [
//       { name: "Michael", age: "23" },
//       { name: "Bob", age: "25" },
//     ];

//     const resPost = await request(app)
//       .post("/v1/fragments")
//       .auth("user1@email.com", "password1")
//       .set("Content-Type", "application/json")
//       .send(fragmentData);
//     expect(resPost.status).toEqual(201);

//     const createdId = resPost.body.fragment.id;

//     const resGet = await request(app)
//       .get(`/v1/fragments/${encodeURIComponent(createdId)}.json`)
//       .auth("user1@email.com", "password1");
//     expect(resGet.statusCode).toBe(200);
//     expect(resGet.headers["content-type"]).toMatch(/^application\/json/);
//     const expectedJson = [
//       { name: "Michael", age: "23" },
//       { name: "Bob", age: "25" },
//     ];
//     expect(resGet.body).toEqual(expectedJson);
//   });

//   //conversing application/json to text/plain
//   test("test extension to converse application/json to text/plain", async () => {
//     const fragmentData = [
//       { name: "Michael", age: "23" },
//       { name: "Bob", age: "25" },
//     ];

//     const resPost = await request(app)
//       .post("/v1/fragments")
//       .auth("user1@email.com", "password1")
//       .set("Content-Type", "application/json")
//       .send(fragmentData);
//     expect(resPost.status).toEqual(201);

//     const createdId = resPost.body.fragment.id;

//     const resGet = await request(app)
//       .get(`/v1/fragments/${encodeURIComponent(createdId)}.txt`)
//       .auth("user1@email.com", "password1");
//     expect(resGet.statusCode).toBe(200);
//     expect(resGet.headers["content-type"]).toMatch(/^text\/plain/);
//     const expectedText = "Michael 23\nBob 25";
//     expect(resGet.text).toBe(expectedText);
//   });

//   //conversing image/jpg to image/png
//   test("text entesion to converse image jpg to image png", async () => {
//     const imagePath = path.join(__dirname, "test.jpg");
//     const image = fs.readFileSync(imagePath);

//     const resPost = await request(app)
//       .post("/v1/fragments")
//       .auth("user1@email.com", "password1")
//       .set("Content-Type", "image/jpeg")
//       .send(image);

//     expect(resPost.status).toEqual(201);

//     const createdId = resPost.body.fragment.id;

//     const resGet = await request(app)
//       .get(`/v1/fragments/${encodeURIComponent(createdId)}.png`)
//       .auth("user1@email.com", "password1");
//     expect(resGet.statusCode).toBe(200);
//     expect(resGet.headers["content-type"]).toMatch(/^image\/png/);
//   });

//   //conversing image/jpg to image/jpg
//   test("text entesion to converse image jpg to image jpg", async () => {
//     const imagePath = path.join(__dirname, "test.jpg");
//     const image = fs.readFileSync(imagePath);

//     const resPost = await request(app)
//       .post("/v1/fragments")
//       .auth("user1@email.com", "password1")
//       .set("Content-Type", "image/jpeg")
//       .send(image);

//     expect(resPost.status).toEqual(201);

//     const createdId = resPost.body.fragment.id;

//     const resGet = await request(app)
//       .get(`/v1/fragments/${encodeURIComponent(createdId)}.jpg`)
//       .auth("user1@email.com", "password1");
//     expect(resGet.statusCode).toBe(200);
//     expect(resGet.headers["content-type"]).toMatch(/^image\/jpeg/);
//   });
// });

const request = require("supertest");
const app = require("../../src/app");
const logger = require("../../src/logger");
const path = require("path");
const fs = require("fs");

describe("GET /v1/fragments/:id", () => {
  test("unauthenticated requests are denied", () =>
    request(app).get("/v1/fragments/:id").expect(401));

  // 401 error
  test("incorrect credentials are denied", () =>
    request(app)
      .get("/v1/fragments/:id")
      .auth("invalid@email.com", "incorrect_password")
      .expect(401));

  // 404 error
  test("Fragment not found", async () => {
    const resGet = await request(app)
      .get(`/v1/fragments/12345`)
      .auth("user1@email.com", "password1");
    expect(resGet.statusCode).toBe(404);
  });

  test("authenticated users get a fragment by id", async () => {
    const fragmentData = "Testing";
    const fragmentDataBuffer = Buffer.from(fragmentData);

    const resPost = await request(app)
      .post("/v1/fragments")
      .auth("user1@email.com", "password1")
      .set("Content-Type", "text/plain")
      .send(fragmentDataBuffer);
    expect(resPost.status).toEqual(201);

    const createdId = resPost.body.fragment.id;

    const resGet = await request(app)
      .get(`/v1/fragments/${createdId}`)
      .auth("user1@email.com", "password1");
    expect(resGet.statusCode).toBe(200);
    expect(resGet.headers["content-type"]).toMatch(/^text\/plain/);
    //logger.info(resGet);
  });

  //conversing text/markdown to text/html
  test("test extension to converse markdown to html", async () => {
    const fragmentData = "Testing";
    const fragmentDataBuffer = Buffer.from(fragmentData);

    const resPost = await request(app)
      .post("/v1/fragments")
      .auth("user1@email.com", "password1")
      .set("Content-Type", "text/markdown")
      .send(fragmentDataBuffer);
    expect(resPost.status).toEqual(201);

    const createdId = resPost.body.fragment.id;

    const resGet = await request(app)
      .get(`/v1/fragments/${encodeURIComponent(createdId)}.html`)
      .auth("user1@email.com", "password1");
    expect(resGet.statusCode).toBe(200);
    expect(resGet.headers["content-type"]).toMatch(/^text\/html/);
    expect(resGet.text).toContain("<p>Testing</p>");
    //logger.info(resGet);
  });

  //invalid conversing between text/markdown and image/jpg
  test("test extension for invalid conversing", async () => {
    const fragmentData = "Testing";
    const fragmentDataBuffer = Buffer.from(fragmentData);

    const resPost = await request(app)
      .post("/v1/fragments")
      .auth("user1@email.com", "password1")
      .set("Content-Type", "text/markdown")
      .send(fragmentDataBuffer);
    expect(resPost.status).toEqual(201);

    const createdId = resPost.body.fragment.id;

    const resGet = await request(app)
      .get(`/v1/fragments/${encodeURIComponent(createdId)}.jpg`)
      .auth("user1@email.com", "password1");
    expect(resGet.statusCode).toBe(415);
    //logger.info(resGet);
  });

  //invalid conversing between text/plain and image/png
  test("No possible conversing between text/plain and image/png", async () => {
    const fragmentData = "test";
    const resPost = await request(app)
      .post("/v1/fragments")
      .auth("user1@email.com", "password1")
      .set("Content-Type", "text/plain")
      .send(fragmentData);
    expect(resPost.status).toEqual(201);

    const createdId = resPost.body.fragment.id;

    const resGet = await request(app)
      .get(`/v1/fragments/${encodeURIComponent(createdId)}.png`)
      .auth("user1@email.com", "password1");
    expect(resGet.statusCode).toBe(415);
  });

  //conversing text/plain to text/plain
  test("test extension to converse text/plain to text/plain", async () => {
    const fragmentData = "Testing";

    const resPost = await request(app)
      .post("/v1/fragments")
      .auth("user1@email.com", "password1")
      .set("Content-Type", "text/plain")
      .send(fragmentData);
    expect(resPost.status).toEqual(201);

    const createdId = resPost.body.fragment.id;

    const resGet = await request(app)
      .get(`/v1/fragments/${encodeURIComponent(createdId)}.txt`)
      .auth("user1@email.com", "password1");
    expect(resGet.statusCode).toBe(200);
    expect(resGet.headers["content-type"]).toBe("text/plain");
    expect(resGet.text).toBe("Testing");
  });

  //conversing text/html to text/html
  test("test extension to converse text/html to text/html", async () => {
    const fragmentData = "<p>Testing</p>";

    const resPost = await request(app)
      .post("/v1/fragments")
      .auth("user1@email.com", "password1")
      .set("Content-Type", "text/html")
      .send(fragmentData);
    expect(resPost.status).toEqual(201);

    const createdId = resPost.body.fragment.id;

    const resGet = await request(app)
      .get(`/v1/fragments/${encodeURIComponent(createdId)}.html`)
      .auth("user1@email.com", "password1");
    expect(resGet.statusCode).toBe(200);
    expect(resGet.headers["content-type"]).toBe("text/html");
    expect(resGet.text).toBe(fragmentData);
  });

  //conversing text/html to text/plain
  test("test extension to converse text/html to text/plain", async () => {
    const fragmentData = "<p>Testing</p>";

    const resPost = await request(app)
      .post("/v1/fragments")
      .auth("user1@email.com", "password1")
      .set("Content-Type", "text/html")
      .send(fragmentData);
    expect(resPost.status).toEqual(201);

    const createdId = resPost.body.fragment.id;

    const resGet = await request(app)
      .get(`/v1/fragments/${encodeURIComponent(createdId)}.txt`)
      .auth("user1@email.com", "password1");
    expect(resGet.statusCode).toBe(200);
    expect(resGet.headers["content-type"]).toMatch(/^text\/plain/);
    expect(resGet.text).toBe("Testing");
    logger.info(resGet.message);
  });

  //conversing text/csv to text/csv
  test("test extension to converse text/csv to text/csv", async () => {
    const fragmentData = "T,e,s,t\ni,n,g";

    const resPost = await request(app)
      .post("/v1/fragments")
      .auth("user1@email.com", "password1")
      .set("Content-Type", "text/csv")
      .send(fragmentData);
    expect(resPost.status).toEqual(201);

    const createdId = resPost.body.fragment.id;

    const resGet = await request(app)
      .get(`/v1/fragments/${encodeURIComponent(createdId)}.csv`)
      .auth("user1@email.com", "password1");
    expect(resGet.statusCode).toBe(200);
    expect(resGet.headers["content-type"]).toBe("text/csv");
    expect(resGet.text).toBe(fragmentData);
  });

  //conversing text/csv to text/plain
  test("test extension to converse text/csv to text/plain", async () => {
    const fragmentData = "T,e,s,t\ni,n,g";

    const resPost = await request(app)
      .post("/v1/fragments")
      .auth("user1@email.com", "password1")
      .set("Content-Type", "text/csv")
      .send(fragmentData);
    expect(resPost.status).toEqual(201);

    const createdId = resPost.body.fragment.id;

    const resGet = await request(app)
      .get(`/v1/fragments/${encodeURIComponent(createdId)}.txt`)
      .auth("user1@email.com", "password1");
    expect(resGet.statusCode).toBe(200);
    expect(resGet.headers["content-type"]).toMatch(/^text\/plain/);
    expect(resGet.text).toBe(fragmentData);
  });

  //conversing text/csv to application/json
  test("test extension to converse text/csv to application/json", async () => {
    const fragmentData = "name,age,city\nMichael,23,North York\nBob,25,Toronto";

    const resPost = await request(app)
      .post("/v1/fragments")
      .auth("user1@email.com", "password1")
      .set("Content-Type", "text/csv")
      .send(fragmentData);
    expect(resPost.status).toEqual(201);

    const createdId = resPost.body.fragment.id;

    const resGet = await request(app)
      .get(`/v1/fragments/${encodeURIComponent(createdId)}.json`)
      .auth("user1@email.com", "password1");
    expect(resGet.statusCode).toBe(200);
    expect(resGet.headers["content-type"]).toMatch(/^application\/json/);
    const expectedJson = [
      { name: "Michael", age: "23", city: "North York" },
      { name: "Bob", age: "25", city: "Toronto" },
    ];
    expect(resGet.body).toEqual(expectedJson);
  });

  //conversing application/json to application/json
  test("test extension to converse text/csv to application/json", async () => {
    const fragmentData = [
      { name: "Michael", age: "23" },
      { name: "Bob", age: "25" },
    ];

    const resPost = await request(app)
      .post("/v1/fragments")
      .auth("user1@email.com", "password1")
      .set("Content-Type", "application/json")
      .send(fragmentData);
    expect(resPost.status).toEqual(201);

    const createdId = resPost.body.fragment.id;

    const resGet = await request(app)
      .get(`/v1/fragments/${encodeURIComponent(createdId)}.json`)
      .auth("user1@email.com", "password1");
    expect(resGet.statusCode).toBe(200);
    expect(resGet.headers["content-type"]).toMatch(/^application\/json/);
    const expectedJson = [
      { name: "Michael", age: "23" },
      { name: "Bob", age: "25" },
    ];
    expect(resGet.body).toEqual(expectedJson);
  });

  //conversing application/json to text/plain
  test("test extension to converse application/json to text/plain", async () => {
    const fragmentData = [
      { name: "Michael", age: "23" },
      { name: "Bob", age: "25" },
    ];

    const resPost = await request(app)
      .post("/v1/fragments")
      .auth("user1@email.com", "password1")
      .set("Content-Type", "application/json")
      .send(fragmentData);
    expect(resPost.status).toEqual(201);

    const createdId = resPost.body.fragment.id;

    const resGet = await request(app)
      .get(`/v1/fragments/${encodeURIComponent(createdId)}.txt`)
      .auth("user1@email.com", "password1");
    expect(resGet.statusCode).toBe(200);
    expect(resGet.headers["content-type"]).toMatch(/^text\/plain/);
    const expectedText = "Michael 23\nBob 25";
    expect(resGet.text).toBe(expectedText);
  });

  //conversing image/jpg to image/png
  test("text entesion to converse image jpg to image png", async () => {
    const imagePath = path.join(__dirname, "test.jpg");
    const image = fs.readFileSync(imagePath);

    const resPost = await request(app)
      .post("/v1/fragments")
      .auth("user1@email.com", "password1")
      .set("Content-Type", "image/jpeg")
      .send(image);

    expect(resPost.status).toEqual(201);

    const createdId = resPost.body.fragment.id;

    const resGet = await request(app)
      .get(`/v1/fragments/${encodeURIComponent(createdId)}.png`)
      .auth("user1@email.com", "password1");
    expect(resGet.statusCode).toBe(200);
    expect(resGet.headers["content-type"]).toMatch(/^image\/png/);
  });

  //conversing image/jpg to image/jpg
  test("text entesion to converse image jpg to image jpg", async () => {
    const imagePath = path.join(__dirname, "test.jpg");
    const image = fs.readFileSync(imagePath);

    const resPost = await request(app)
      .post("/v1/fragments")
      .auth("user1@email.com", "password1")
      .set("Content-Type", "image/jpeg")
      .send(image);

    expect(resPost.status).toEqual(201);

    const createdId = resPost.body.fragment.id;

    const resGet = await request(app)
      .get(`/v1/fragments/${encodeURIComponent(createdId)}.jpg`)
      .auth("user1@email.com", "password1");
    expect(resGet.statusCode).toBe(200);
    expect(resGet.headers["content-type"]).toMatch(/^image\/jpeg/);
  });
});
