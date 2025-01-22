// routes/leaderboardRoutes.js
const express = require("express");
const { getLeaderboard } = require("../controllers/leaderboardController");
const { jwtAuthMiddleware } = require("../jwt");

const router = express.Router();

router.get("/leaderboard", jwtAuthMiddleware, getLeaderboard);

module.exports = router;
