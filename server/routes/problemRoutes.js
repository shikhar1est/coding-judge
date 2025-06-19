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

/**
 * @swagger
 * tags:
 *   name: Problems
 *   description: Problem CRUD operations
 */

/**
 * @swagger
 * /api/problems/create:
 *   post:
 *     summary: Create a new coding problem (Admin only)
 *     tags: [Problems]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, testCases]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               constraints:
 *                 type: string
 *               sampleInput:
 *                 type: string
 *               sampleOutput:
 *                 type: string
 *               testCases:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     input:
 *                       type: string
 *                     expectedOutput:
 *                       type: string
 *     responses:
 *       201:
 *         description: Problem created
 */

/**
 * @swagger
 * /api/problems:
 *   get:
 *     summary: Get all problems (Any user)
 *     tags: [Problems]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of problems
 */

/**
 * @swagger
 * /api/problems/{id}:
 *   get:
 *     summary: Get a specific problem by ID
 *     tags: [Problems]
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
 *         description: Problem found
 *       404:
 *         description: Problem not found
 */

/**
 * @swagger
 * /api/problems/{id}:
 *   delete:
 *     summary: Delete a problem by ID (Admin only)
 *     tags: [Problems]
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
 *         description: Problem deleted
 */

/**
 * @swagger
 * /api/problems/{id}:
 *   put:
 *     summary: Update a problem by ID (Admin only)
 *     tags: [Problems]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Problem ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               constraints:
 *                 type: string
 *               sampleInput:
 *                 type: string
 *               sampleOutput:
 *                 type: string
 *               testCases:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     input:
 *                       type: string
 *                     expectedOutput:
 *                       type: string
 *     responses:
 *       200:
 *         description: Problem updated
 */

router.post("/create", verifyToken, isAdmin, createProblem);
router.get("/", verifyToken, getAllProblems);
router.get("/:id", verifyToken, getProblemById);
router.delete("/:id", verifyToken, isAdmin, deleteProblem);
router.put("/:id", verifyToken, isAdmin, updateProblem);

module.exports = router;
