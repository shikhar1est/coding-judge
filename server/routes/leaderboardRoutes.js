const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

const Submission = require("../models/Submission");

/**
 * @swagger
 * /api/leaderboard:
 *   get:
 *     summary: Get leaderboard ranked by accepted submissions
 *     tags: [Leaderboard]
 *     responses:
 *       200:
 *         description: Leaderboard data
 */
router.get("/", verifyToken, async (req, res) => {
  try {
    const data = await Submission.aggregate([
      { $match: { status: "accepted" } },
      { $group: { _id: "$user", acceptedCount: { $sum: 1 } } },
      { $sort: { acceptedCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      {
        $project: {
          _id: 0,
          email: { $arrayElemAt: ["$userInfo.email", 0] },
          acceptedCount: 1
        }
      }
    ]);

    res.json({ leaderboard: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Leaderboard failed" });
  }
});

module.exports = router;
