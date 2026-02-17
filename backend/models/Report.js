const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  repoId: { type: mongoose.Schema.Types.ObjectId, ref: "Repo", required: true },
  commitCount: { type: Number, required: true },
  qualityScore: { type: Number, required: true },
  summary: { type: String, required: true },
  suggestions: { type: String },
  securityConcerns: { type: String },
  analyzedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Report", reportSchema);
