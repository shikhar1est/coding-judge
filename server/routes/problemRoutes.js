const express = require("express");
const router = express.Router();

const {
  createProblem,
  getAllProblems,
  getProblemById,
  deleteProblem,
  updateProblem
} = require("../controllers/problemController");

const verifyToken = require("../middleware/verifyToken");
const isAdmin = require("../middleware/isAdmin");

// Create problem (admin)
router.post("/create", verifyToken, isAdmin, createProblem);

// Get all problems (any authenticated user)
router.get("/", verifyToken, getAllProblems);

// Get one problem
router.get("/:id", verifyToken, getProblemById);

// Delete problem (admin)
router.delete("/:id", verifyToken, isAdmin, deleteProblem);

router.put("/:id", verifyToken, isAdmin, updateProblem);

module.exports = router;
