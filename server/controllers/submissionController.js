const Problem = require("../models/Problem");
const Submission = require("../models/Submission");
const executeCode = require("../utils/codeExecutor"); // You’ll build this next

exports.submitCode = async (req, res) => {
  try {
    const { code, language, problemId } = req.body;

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    const results = [];

    for (const testCase of problem.testCases) {
      const { input, expectedOutput } = testCase;

      const { output, error } = await executeCode(code, language, input);

      results.push({
        input,
        expectedOutput,
        userOutput: output || "",
        passed: output?.trim() === expectedOutput?.trim(),
        error
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

    res.status(200).json({
      message: "Submission evaluated",
      results
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Submission failed", details: err.message });
  }
};
