const express = require("express");
const router = express.Router();
const Repo = require("../models/Repo");
const Report = require("../models/Report");
const User = require("../models/User");
const { fetchRepoCommits, getCommitActivity } = require("../services/githubService");
const { analyzeRepo } = require("../services/aiService");

// POST /analysis/trigger/:repoId - Manually trigger analysis
router.post("/trigger/:repoId", async (req, res) => {
  try {
    const { repoId } = req.params;
    const { userId } = req.body; // passed from frontend

    const user = await User.findOne({ githubId: userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const repo = await Repo.findById(repoId);
    if (!repo) return res.status(404).json({ error: "Repository not found" });

    // Fetch commits
    const commits = await fetchRepoCommits(repo.owner, repo.name, user.accessToken);
    const commitMessages = commits.map(c => c.commit.message);

    // AI Analysis
    const analysis = await analyzeRepo(repo.name, commits.length, commitMessages);

    // --- New Health Score Logic ---

    // 1. AI Score (50% weight)
    const aiScore = analysis.score || 0;

    // 2. Consistency Score (30% weight)
    // Simple metric: commits per week (active)
    // Let's assume broad consistency if commits > 5 in last week, or strictly per week over a range
    // Since we fetch last 100 commits, let's see time range.
    let consistencyScore = 50; // Default
    if (commits.length > 0) {
      const firstCommitDate = new Date(commits[commits.length - 1].commit.author.date);
      const lastCommitDate = new Date(commits[0].commit.author.date);
      const daysDiff = (lastCommitDate - firstCommitDate) / (1000 * 60 * 60 * 24);
      const weeks = Math.max(daysDiff / 7, 1);
      const commitsPerWeek = commits.length / weeks;

      if (commitsPerWeek >= 10) consistencyScore = 100;
      else if (commitsPerWeek >= 5) consistencyScore = 80;
      else if (commitsPerWeek >= 2) consistencyScore = 60;
      else consistencyScore = 40;
    }

    // 3. Activity Score (20% weight)
    // Recency of last commit
    let activityScore = 0;
    if (commits.length > 0) {
      const lastCommitDate = new Date(commits[0].commit.author.date);
      const today = new Date();
      const daysSinceLast = (today - lastCommitDate) / (1000 * 60 * 60 * 24);

      if (daysSinceLast <= 3) activityScore = 100;
      else if (daysSinceLast <= 7) activityScore = 90;
      else if (daysSinceLast <= 14) activityScore = 70;
      else if (daysSinceLast <= 30) activityScore = 50;
      else activityScore = 20;
    }

    // Weighted Formula
    const finalScore = Math.round(
      (aiScore * 0.5) + (consistencyScore * 0.3) + (activityScore * 0.2)
    );

    // Save Report
    const report = await Report.create({
      repoId: repo._id,
      commitCount: commits.length,
      qualityScore: finalScore,
      aiScore: aiScore,
      consistencyScore: consistencyScore,
      activityScore: activityScore,
      summary: analysis.qualityReview || "No review available",
      suggestions: JSON.stringify(analysis.suggestions) || "[]",
      securityConcerns: analysis.securityConcerns || "None",
    });

    // Update Repo lastAnalyzed, healthScore, and activityStatus
    repo.lastAnalyzed = new Date();
    repo.healthScore = finalScore;

    await repo.save();

    res.json(report);
  } catch (error) {
    console.error("Analysis Error:", error);
    res.status(500).json({ error: "Analysis failed" });
  }
});

// GET /analysis/history/:repoId - Get past reports
router.get("/history/:repoId", async (req, res) => {
  try {
    const { repoId } = req.params;
    const reports = await Report.find({ repoId }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

// GET /analysis/commits/:repoId - Get commit trend data
router.get("/commits/:repoId", async (req, res) => {
  try {
    const { repoId } = req.params;
    const { userId, range } = req.query; // range: daily, weekly, monthly

    if (!userId) return res.status(400).json({ error: "User ID required" });

    const user = await User.findOne({ githubId: userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const repo = await Repo.findById(repoId);
    if (!repo) return res.status(404).json({ error: "Repository not found" });

    let days = 30; // Default Daily
    if (range === "weekly") days = 90;
    if (range === "monthly") days = 365;

    const activity = await getCommitActivity(repo.owner, repo.name, user.accessToken, days);

    res.json(activity);
  } catch (error) {
    console.error("Commit Activity Error:", error);
    res.status(500).json({ error: "Failed to fetch commit activity" });
  }
});

// GET /analysis/compare/:repoId1/:repoId2 - Compare two repos
router.get("/compare/:repoId1/:repoId2", async (req, res) => {
  try {
    const { repoId1, repoId2 } = req.params;

    const [repo1, repo2] = await Promise.all([
      Repo.findById(repoId1),
      Repo.findById(repoId2)
    ]);

    if (!repo1 || !repo2) {
      return res.status(404).json({ error: "One or both repositories not found" });
    }

    const [report1, report2] = await Promise.all([
      Report.findOne({ repoId: repoId1 }).sort({ createdAt: -1 }),
      Report.findOne({ repoId: repoId2 }).sort({ createdAt: -1 })
    ]);

    res.json({
      repo1: { details: repo1, report: report1 || null },
      repo2: { details: repo2, report: report2 || null }
    });
  } catch (error) {
    console.error("Comparison Error:", error);
    res.status(500).json({ error: "Failed to compare repositories" });
  }
});

// DELETE /analysis/:reportId - Delete a report
router.delete("/:reportId", async (req, res) => {
  try {
    const { reportId } = req.params;
    const report = await Report.findByIdAndDelete(reportId);

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: "Failed to delete report" });
  }
});

module.exports = router;
