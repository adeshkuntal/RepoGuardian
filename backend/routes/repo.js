const express = require("express");
const router = express.Router();
const Repo = require("../models/Repo");
const User = require("../models/User");
const { fetchUserRepos } = require("../services/githubService");

// Middleware to check if user is authenticated (mocked via query param or header for MVP if needed, 
// allows passing userId/accessToken in request for implicit auth if we don't use sessions)
// For this MVP, we'll assume the frontend sends userId in headers or body.

// GET /repo/github/fetch - Fetch all repos from GitHub for the user
router.get("/github/fetch", async (req, res) => {
  try {
    const { userId } = req.query; // Expecting userId
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    const user = await User.findOne({ githubId: userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const repos = await fetchUserRepos(user.accessToken);
    res.json(repos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /repo/monitor - Add a repo to monitor
router.post("/monitor", async (req, res) => {
  try {
    const { userId, repo } = req.body;

    // Find internal user _id based on githubId
    const user = await User.findOne({ githubId: userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Check if check already exists
    let existing = await Repo.findOne({ githubRepoId: repo.id, userId: user._id });
    if (existing) {
      return res.status(400).json({ error: "Repository already monitored" });
    }

    const newRepo = await Repo.create({
      userId: user._id,
      githubRepoId: repo.id,
      name: repo.name,
      owner: repo.owner.login,
      url: repo.html_url,
      description: repo.description,
      language: repo.language
    });

    res.status(201).json(newRepo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add repository" });
  }
});

// GET /repo/monitored - Get all monitored repos for user
router.get("/monitored", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    const user = await User.findOne({ githubId: userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const repos = await Repo.find({ userId: user._id }).sort({ createdAt: -1 });
    res.json(repos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch monitored repositories" });
  }
});

module.exports = router;
