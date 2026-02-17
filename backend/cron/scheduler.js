const cron = require("node-cron");
const Repo = require("../models/Repo");
const Report = require("../models/Report");
const User = require("../models/User");
const { fetchRepoCommits } = require("../services/githubService");
const { analyzeRepo } = require("../services/aiService");

// Run every day at midnight
cron.schedule("0 0 * * *", async () => {
  console.log("Running Daily Repo Analysis...");

  try {
    const repos = await Repo.find({ isActive: true }).populate("userId"); // Populate to get accessToken

    for (const repo of repos) {
      if (!repo.userId || !repo.userId.accessToken) continue;

      try {
        console.log(`Analyzing ${repo.name}...`);

        // Fetch commits
        const commits = await fetchRepoCommits(repo.owner, repo.name, repo.userId.accessToken);
        const commitMessages = commits.map(c => c.commit.message);

        // AI Analysis
        const analysis = await analyzeRepo(repo.name, commits.length, commitMessages);

        // Save Report
        await Report.create({
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

      } catch (err) {
        console.error(`Error analyzing repo ${repo.name}:`, err.message);
      }
    }

    console.log("Daily Analysis Completed.");
  } catch (error) {
    console.error("Cron Job Error:", error);
  }
});
