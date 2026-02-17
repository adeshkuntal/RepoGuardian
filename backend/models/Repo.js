const mongoose = require("mongoose");

const repoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  githubRepoId: { type: String, required: true },
  name: { type: String, required: true },
  owner: { type: String, required: true },
  url: { type: String, required: true },
  description: String,
  language: String,
  lastAnalyzed: { type: Date, default: null },
  isActive: { type: Boolean, default: true },
  healthScore: { type: Number, default: 0 },
  activityStatus: { type: String, enum: ['Active', 'Moderate', 'Inactive'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model("Repo", repoSchema);
