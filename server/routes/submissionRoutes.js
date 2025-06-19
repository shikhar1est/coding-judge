const express = require("express");
const router = express.Router();
const { submitCode } = require("../controllers/submissionController");
const verifyToken = require("../middleware/verifyToken");

router.post("/submit", verifyToken, submitCode);

module.exports = router;
