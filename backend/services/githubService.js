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

module.exports = {
  fetchUserRepos,
  fetchRepoCommits,
};
