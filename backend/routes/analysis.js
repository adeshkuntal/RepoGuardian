const express = require("express");
const router = express.Router();
const Repo = require("../models/Repo");
const Report = require("../models/Report");
const User = require("../models/User");
const { fetchRepoCommits } = require("../services/githubService");
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

    // Save Report
    const report = await Report.create({
      repoId: repo._id,
      commitCount: commits.length,
      qualityScore: analysis.score || 0,
      summary: analysis.qualityReview || "No review available",
      suggestions: JSON.stringify(analysis.suggestions) || "[]",
      securityConcerns: analysis.securityConcerns || "None",
    });

    // Update Repo lastAnalyzed
    repo.lastAnalyzed = new Date();
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
