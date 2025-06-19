const Problem = require("../models/Problem");
const Submission = require("../models/Submission");
const executeCode = require("../utils/codeExecutor");

exports.submitCode = async (req, res) => {
  try {
    const { code, language, problemId } = req.body;

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    const results = [];
    let passedCount = 0;

    for (const testCase of problem.testCases) {
      const { input, expectedOutput } = testCase;
      const { output } = await executeCode(code, language, input);

      const cleanOutput = (output || "").trim();
      const cleanExpected = (expectedOutput || "").trim();

      const passed = cleanOutput === cleanExpected;
      if (passed) passedCount++;

      results.push({
        input,
        expected: cleanExpected,
        output: cleanOutput,
        passed
      });
    }

    const submission = new Submission({
      user: req.user.id,
      problem: problemId,
      language,
      code,
      results
    });

    await submission.save();

    const status =
      passedCount === results.length
        ? "accepted"
        : passedCount === 0
        ? "rejected"
        : "partially-accepted";

    res.status(200).json({
      message: "Submission evaluated",
      status,
      score: `${passedCount} / ${results.length}`,
      results
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Submission failed", details: err.message });
  }
};

exports.getUserSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user.id }).populate("problem", "title");
    res.json({ submissions });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
};

exports.getProblemSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ problem: req.params.id }).populate("user", "name email");
    res.json({ submissions });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch problem submissions" });
  }
};
