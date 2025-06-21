// sample-data.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const Problem = require("./models/Problem");

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear old data
    await User.deleteMany({});
    await Problem.deleteMany({});

    // Create Admin
    const adminPassword = await bcrypt.hash("admin123", 10);
    const admin = await User.create({
      username: "admin",
      email: "admin@example.com",
      password: adminPassword,
      role: "admin",
    });

    // Create Regular User
    const userPassword = await bcrypt.hash("user123", 10);
    const user = await User.create({
      username: "student",
      email: "student@example.com",
      password: userPassword,
      role: "user",
    });

    // Create Problems
    const problem1 = await Problem.create({
      title: "Count Vowels",
      description: "Count the number of vowels in the given input string.",
      constraints: "1 <= |s| <= 100",
      sampleInput: "education",
      sampleOutput: "5",
      testCases: [
        { input: "apple", expectedOutput: "2" },
        { input: "bcdfg", expectedOutput: "0" },
        { input: "education", expectedOutput: "5" },
        { input: "abracadabra", expectedOutput: "5" },
        { input: "xyz", expectedOutput: "0" },
      ],
      createdBy: admin._id,
    });

    console.log("✅ Sample data seeded successfully.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to seed sample data:", err);
    process.exit(1);
  }
};

seed();
