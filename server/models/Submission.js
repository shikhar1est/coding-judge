const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  problem: { type: mongoose.Schema.Types.ObjectId, ref: "Problem", required: true },
  language: {
    type: String,
    enum: ["cpp", "python", "javascript"],
    required: true
  },
  code: { type: String, required: true },
  results: [
    {
      input: String,
      expected: String,
      output: String,
      passed: Boolean
    }
  ],
  status: {
    type: String,
    enum: ["accepted", "partially-accepted", "rejected"],
    default: "rejected"
  }
}, { timestamps: true });

module.exports = mongoose.model("Submission", submissionSchema);
