const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");

describe("Submission API", () => {
  let server;
  let problemId;
  let userToken;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await new Promise((res) => setTimeout(res, 300)); // Small delay for stability
    server = app.listen(4002);

    // Register admin user
    const adminRes = await request(server)
      .post("/api/auth/register")
      .send({
        username: "adminUser",
        email: "admin@example.com",
        password: "admin123",
        role: "admin"
      });

    const adminToken = adminRes.body.token;
    if (!adminToken) {
      console.error("❌ Admin token not received. Check /register response:", adminRes.body);
      return;
    }

    // Create problem using admin token
    const problemRes = await request(server)
      .post("/api/problems/create")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Count A",
        description: "Count number of 'a's in the input",
        sampleInput: "banana",
        sampleOutput: "3",
        testCases: [
          { input: "banana", expectedOutput: "3" },
          { input: "apple", expectedOutput: "1" }
        ]
      });

    if (!problemRes.body.problem) {
      console.error("❌ Problem creation failed:", problemRes.body);
      return;
    }

    problemId = problemRes.body.problem._id;

    // Register user
    const userRes = await request(server)
      .post("/api/auth/register")
      .send({
        username: "student1",
        email: "student1@example.com",
        password: "userpass123"
      });

    userToken = userRes.body.token;
  }, 20000); // ⏳ increased timeout

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  it("should evaluate code submission and return results", async () => {
    const res = await request(server)
      .post("/api/submit")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        code: "print(input().count('a'))",
        language: "python",
        problemId
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("results");
    expect(Array.isArray(res.body.results)).toBe(true);
  }, 15000); // 🧠 allow enough time

  it("should return user's submissions", async () => {
    const res = await request(server)
      .get("/api/submit/user")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.submissions)).toBe(true);
  });

  it("should return problem-specific submissions", async () => {
    const res = await request(server)
      .get(`/api/submit/${problemId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.submissions)).toBe(true);
  });
});
