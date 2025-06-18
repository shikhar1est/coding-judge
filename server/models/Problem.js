const mongoose=require("mongoose")

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true }
});

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  constraints: { type: String },
  sampleInput: { type: String },
  sampleOutput: { type: String },
  testCases: [testCaseSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Problem", problemSchema);
