require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { swaggerUi, specs } = require("./swagger");

const app = express();

//Enable CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());

//Swagger setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// 🛣️ API Routes
const authRoutes = require("./routes/authRoutes");
const problemRoutes = require("./routes/problemRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api", submissionRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

module.exports = app;
