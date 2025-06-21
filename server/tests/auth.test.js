const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");

describe("Auth API", () => {
  let server;

  beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  server = app.listen(4003);
});


  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  const testUser = {
    username: "testuser",
    email: "testuser@example.com",
    password: "testpass123"
  };

  it("should register a new user", async () => {
    const res = await request(server)
      .post("/api/auth/register")
      .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
  });

  it("should login an existing user", async () => {
    const res = await request(server)
      .post("/api/auth/login")
      .send({ email: testUser.email, password: testUser.password });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
