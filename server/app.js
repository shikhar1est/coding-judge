require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { swaggerUi, specs } = require("./swagger");

const app = express();
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

const authRoutes = require("./routes/authRoutes");
const problemRoutes = require("./routes/problemRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api", submissionRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

module.exports = app;
