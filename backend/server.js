require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const repoRoutes = require("./routes/repo");
const analysisRoutes = require("./routes/analysis");

require("./cron/scheduler");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/auth", authRoutes);
app.use("/repo", repoRoutes);
app.use("/analysis", analysisRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
