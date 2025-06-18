const Problem = require("../models/Problem");

exports.createProblem = async (req, res) => {  //Defines the controller function that will run when POST /api/problems is hit
  try {
    const { title, description, constraints, sampleInput, sampleOutput, testCases } = req.body;

    // Only admins allowed 
    if (req.user.role !== "admin") { //This assumes a JWT middleware already added req.user 
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    const problem = new Problem({
      title,
      description,
      constraints,
      sampleInput,
      sampleOutput,
      testCases,
      createdBy: req.user.id
    });

    await problem.save();
    res.status(201).json({ message: "Problem created successfully", problem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create problem" });
  }
};
exports.getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find().select("title description");
    res.json(problems);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch problems" });
  }
};

exports.getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ error: "Problem not found" });
    res.json(problem);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch problem", details: err.message });
  }
};

exports.deleteProblem = async (req, res) => {
  try {
    const deleted = await Problem.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Problem not found" });
    res.json({ message: "Problem deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete problem", details: err.message });
  }
};

exports.updateProblem = async (req, res) => {
  try {
    const updated = await Problem.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Problem not found" });
    }

    res.json({ message: "Problem updated successfully", problem: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update problem", details: err.message });
  }
};




