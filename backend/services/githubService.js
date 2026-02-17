const axios = require("axios");

const fetchUserRepos = async (accessToken) => {
  try {
    const response = await axios.get("https://api.github.com/user/repos?sort=updated&per_page=100", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user repos:", error);
    throw new Error("Failed to fetch repositories from GitHub");
  }
};

const fetchRepoCommits = async (owner, repo, accessToken) => {
  try {
    // Fetch last 100 commits to analyze activity
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=100`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching commits for ${owner}/${repo}:`, error);
    // Return empty array if fails (e.g., empty repo)
    return [];
  }
};

const getCommitActivity = async (owner, repo, accessToken, days = 30) => {
  try {
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);
    const since = sinceDate.toISOString();

    // Fetch commits since the calculated date (max 100 per page, maybe need pagination for active repos, 
    // but for now 1 page of 100 might miss data if very active. Let's try fetching up to 300 via 3 pages or just 100 for MVP speed)
    // Actually, let's just fetch 100 for now to keep it fast, or use `per_page=100`.
    // If the user wants accurate trends for active repos, we should loop. 
    // But for this task, let's stick to a simple implementation: 
    // "Fetch commits from GitHub API ... max 100/200" per plan.

    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits`, {
      params: {
        since,
        per_page: 100, // Limit to 100 for performance
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    const commits = response.data;

    // Group by date
    const commitMap = {}; // "YYYY-MM-DD": count

    // Initialize map with 0 for all days in range to show gaps? 
    // The requirement says "X-axis: date". Chart.js handles missing dates if we provide labels.
    // Better to fill gaps for a smooth line chart.

    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      commitMap[dateStr] = 0;
    }

    commits.forEach(commit => {
      const date = commit.commit.author.date.split("T")[0]; // YYYY-MM-DD
      if (commitMap[date] !== undefined) {
        commitMap[date]++;
      }
    });

    // Convert to array and sort by date
    const activity = Object.keys(commitMap).sort().map(date => ({
      date,
      count: commitMap[date]
    }));

    return activity;

  } catch (error) {
    console.error(`Error fetching commit activity for ${owner}/${repo}:`, error);
    return [];
  }
};

module.exports = {
  fetchUserRepos,
  fetchRepoCommits,
  getCommitActivity,
};
