const express = require("express");
const router = express.Router();
const { submitCode, getUserSubmissions, getProblemSubmissions } = require("../controllers/submissionController");
const verifyToken = require("../middleware/verifyToken");
const isAdmin = require("../middleware/isAdmin");

router.post("/submit", verifyToken, submitCode);
router.get("/submissions", verifyToken, getUserSubmissions);
router.get("/problems/:id/submissions", verifyToken, isAdmin, getProblemSubmissions);

module.exports = router;
