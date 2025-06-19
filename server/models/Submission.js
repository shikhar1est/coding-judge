const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  problem: { type: mongoose.Schema.Types.ObjectId, ref: "Problem", required: true },
  language: { type: String, enum: ["cpp", "python", "javascript"], required: true },
  code: { type: String, required: true },
  results: [
    {
      input: String,
      expectedOutput: String,
      userOutput: String,
      passed: Boolean,
      error: String
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Submission", submissionSchema);
