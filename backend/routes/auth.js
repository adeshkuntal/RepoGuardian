const express = require("express");
const axios = require("axios");
const User = require("../models/User");
const router = express.Router();

router.get("/github", (req, res) => {
  const url =
    `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}`;
  res.redirect(url);
});

router.get("/github/callback", async (req, res) => {
  const { code } = req.query;

  const tokenRes = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code,
    },
    { headers: { Accept: "application/json" } }
  );

  const accessToken = tokenRes.data.access_token;

  const userRes = await axios.get("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const { id, login } = userRes.data;

  let user = await User.findOne({ githubId: id });

  if (!user) {
    user = await User.create({
      githubId: id,
      username: login,
      accessToken,
    });
  }

  res.redirect("http://localhost:5173/dashboard?user=" + id);
});

module.exports = router;
