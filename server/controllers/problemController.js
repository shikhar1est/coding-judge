const Problem = require("../models/Problem");

// 🧠 Utility to parse raw test case string into structured objects
const parseTestCases = (inputString) => {
  if (!inputString) return [];
  return inputString
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.includes('=>'))
    .map(line => {
      const [input, expectedOutput] = line.split('=>').map(s => s.trim());
      return { input, expectedOutput };
    });
};

// ✅ CREATE
exports.createProblem = async (req, res) => {
  console.log("🔁 Incoming request body:", JSON.stringify(req.body, null, 2));

  const {
    title,
    description,
    constraints,
    difficulty,
    tags,
    sampleTests,
    hiddenTests
  } = req.body;

  console.log("📦 sampleTests:", sampleTests);
  console.log("📦 hiddenTests:", hiddenTests);

  const parsedSamples = Array.isArray(sampleTests)
    ? sampleTests.map(({ input, output }) => ({ input, expectedOutput: output }))
    : [];

  const parsedHidden = Array.isArray(hiddenTests)
    ? hiddenTests.map(({ input, expectedOutput }) => ({ input, expectedOutput }))
    : [];

  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admins only" });
    }

    const problem = new Problem({
      title,
      description,
      constraints,
      difficulty,
      tags,
      sampleInput: parsedSamples[0]?.input || '',
      sampleOutput: parsedSamples[0]?.expectedOutput || '',
      sampleTests: parsedSamples,              // ✅ fix
      hiddenTests: parsedHidden,               // ✅ fix
      testCases: parsedHidden,                 // optional
      createdBy: req.user.id
    });

    await problem.save();
    console.log("🛢️ Saved problem:", problem);
    res.status(201).json({ message: "Problem created", problem });
  } catch (err) {
    console.error("❌ CreateProblem error:", err);
    res.status(500).json({ error: "Create failed", details: err.message });
  }
};


// ✅ GET ALL
exports.getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find().select("title description difficulty tags");
    res.json(problems);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch problems" });
  }
};

// ✅ GET BY ID
exports.getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ error: "Problem not found" });
    res.json(problem);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch problem", details: err.message });
  }
};

// ✅ UPDATE
exports.updateProblem = async (req, res) => {
  try {
    const updated = await Problem.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Problem not found" });

    res.json({ message: "Problem updated successfully", problem: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update problem", details: err.message });
  }
};

// ✅ DELETE
exports.deleteProblem = async (req, res) => {
  try {
    const deleted = await Problem.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Problem not found" });

    res.status(200).json({ message: "Problem deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete problem", details: err.message });
  }
};
