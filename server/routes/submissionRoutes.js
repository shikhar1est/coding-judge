const express = require("express");
const router = express.Router();
const {
  submitCode,
  getUserSubmissions,
  getProblemSubmissions
} = require("../controllers/submissionController");

const verifyToken = require("../middleware/verifyToken");
const isAdmin = require("../middleware/isAdmin");
const submissionLimiter = require("../middleware/rateLimiter");

/**
 * @swagger
 * tags:
 *   name: Submissions
 *   description: Code submission and result history
 */

/**
 * @swagger
 * /api/submit:
 *   post:
 *     summary: Submit code for a problem
 *     tags: [Submissions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, language, problemId]
 *             properties:
 *               code:
 *                 type: string
 *               language:
 *                 type: string
 *               problemId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Submission evaluated
 */

/**
 * @swagger
 * /api/submissions:
 *   get:
 *     summary: Get all submissions for current user
 *     tags: [Submissions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's submissions
 */

/**
 * @swagger
 * /api/problems/{id}/submissions:
 *   get:
 *     summary: Get all submissions for a problem (Admin only)
 *     tags: [Submissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Problem ID
 *     responses:
 *       200:
 *         description: List of submissions for the specified problem
 */

/**
 * @swagger
 * /api/test-rate:
 *   post:
 *     summary: Test the rate limiter
 *     tags: [Submissions]
 *     responses:
 *       200:
 *         description: Successful response if within rate limit
 *       429:
 *         description: Rate limit exceeded
 */

router.post("/submit", verifyToken, submitCode);
router.get("/submissions", verifyToken, getUserSubmissions);
router.get("/problems/:id/submissions", verifyToken, isAdmin, getProblemSubmissions);

// Temporary rate limit tester
router.post("/test-rate", submissionLimiter, (req, res) => {
  res.json({ message: "You made it before rate limit hit!" });
});

module.exports = router;
