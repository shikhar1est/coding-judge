const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret";

// ✅ Create a valid ObjectId for admin
const dummyAdminId = new mongoose.Types.ObjectId();
const adminToken = jwt.sign({ id: dummyAdminId.toString(), role: "admin" }, JWT_SECRET, { expiresIn: "1h" });

describe("Problem API", () => {
  let server;
  let createdProblemId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    // Small wait to ensure DB ready before test starts
    await new Promise((res) => setTimeout(res, 300));
    server = app.listen(4001);
  }, 20000); // Increased timeout

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  it("should create a new problem (admin only)", async () => {
    const res = await request(server)
      .post("/api/problems/create")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Add Two Numbers",
        description: "Add two integers and return the sum.",
        constraints: "1 <= a,b <= 1000",
        sampleInput: "2 3",
        sampleOutput: "5",
        testCases: [
          { input: "2 3", expectedOutput: "5" },
          { input: "100 200", expectedOutput: "300" }
        ]
      });

    if (res.statusCode !== 201) {
      console.error("❌ Problem creation failed:", res.body);
    }

    expect(res.statusCode).toBe(201);
    expect(res.body.problem).toHaveProperty("_id");
    expect(res.body.problem.title).toBe("Add Two Numbers");

    createdProblemId = res.body.problem._id;
  });

  it("should fail to create a problem without admin token", async () => {
    const res = await request(server)
      .post("/api/problems/create")
      .send({
        title: "Invalid Test",
        description: "This should fail.",
        sampleInput: "1",
        sampleOutput: "2",
        testCases: [{ input: "1", expectedOutput: "2" }]
      });

    expect(res.statusCode).toBe(401); // Token missing
  });

  it("should delete the problem", async () => {
    const res = await request(server)
      .delete(`/api/problems/${createdProblemId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});
