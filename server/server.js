// Load environment variables from .env
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Route imports
const authRoutes = require("./routes/authRoutes"); // You'll create this soon

// Use Routes
app.use("/api/auth", authRoutes);

const problemRoutes = require("./routes/problemRoutes");
app.use("/api/problems", problemRoutes);


// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });
