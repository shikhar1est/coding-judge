const Problem = require("../models/Problem");
const Submission = require("../models/Submission");
const executeCode = require("../utils/codeExecutor");
const esprima = require("esprima");

// ✅ Multi-language token extractor
function extractTokens(code, language) {
  if (language === "javascript") {
    try {
      const raw = esprima.tokenize(code);
      const skipTokens = new Set([
        "require", "console", "log", "readFileSync", "fs", "utf-8", ";", ".", "(", ")", "{", "}", ",", ":", "'"
      ]);
      return raw
        .map(t => t.value)
        .filter(token => token && !skipTokens.has(token.toLowerCase()));
    } catch (err) {
      return [];
    }
  }

  // Fallback for Python and C++
  return code
    .split(/\W+/) // split on non-word characters
    .filter(token => token.length > 1); // ignore very short/trivial tokens
}

// 🔁 Jaccard similarity
function jaccardSimilarity(tokensA, tokensB) {
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);
  const intersection = [...setA].filter(x => setB.has(x));
  const union = new Set([...setA, ...setB]);
  return union.size === 0 ? 0 : intersection.length / union.size;
}

exports.submitCode = async (req, res) => {
  try {
    const { code, language, problemId } = req.body;

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    // ✂️ Tokenize based on language
    const currentTokens = extractTokens(code, language);

    if (currentTokens.length < 5) {
      return res.status(400).json({ error: "Code is too short or trivial to evaluate meaningfully." });
    }

    // 🧠 Fetch prior submissions
    const previous = await Submission.find({ problem: problemId, language }).select("tokens");

    let highestScore = 0;
    for (const prev of previous) {
      if (!prev.tokens || !Array.isArray(prev.tokens)) continue;
      const score = jaccardSimilarity(currentTokens, prev.tokens);
      if (score > highestScore) highestScore = score;
    }

    const plagiarismScore = parseFloat((highestScore * 100).toFixed(2));
    const plagiarismFlag = plagiarismScore >= 80;

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

    const status =
      passedCount === results.length
        ? "accepted"
        : passedCount === 0
        ? "rejected"
        : "partially-accepted";

    const submission = new Submission({
      user: req.user.id,
      problem: problemId,
      language,
      code,
      results,
      status,
      plagiarismScore,
      plagiarismFlag,
      tokens: currentTokens
    });

    await submission.save();

    res.status(200).json({
      message: "Submission evaluated",
      status,
      score: `${passedCount} / ${results.length}`,
      plagiarismScore,
      plagiarismFlag,
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
