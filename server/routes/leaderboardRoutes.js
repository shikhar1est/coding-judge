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
      {
        $group: {
          _id: "$user",
          acceptedCount: {
            $sum: {
              $cond: [{ $eq: ["$status", "accepted"] }, 1, 0]
            }
          },
          total: { $sum: 1 }
        }
      },
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
          username: { $arrayElemAt: ["$userInfo.username", 0] },
          email: { $arrayElemAt: ["$userInfo.email", 0] },
          acceptedCount: 1,
          totalSubmissions: "$total",
          accuracy: {
            $cond: [
              { $eq: ["$total", 0] },
              0,
              {
                $round: [
                  { $multiply: [{ $divide: ["$acceptedCount", "$total"] }, 100] },
                  2
                ]
              }
            ]
          }
        }
      },
      { $sort: { acceptedCount: -1 } },
      { $limit: 10 }
    ]);

    res.json({ leaderboard: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Leaderboard failed" });
  }
});

module.exports = router;
