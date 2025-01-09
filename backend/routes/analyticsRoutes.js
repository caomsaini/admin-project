const express = require("express");
const Analytics = require("../models/Analytics");
const { calculateBounceRate, calculateVisitorsActivity } = require("../services/analyticsService");
const router = express.Router();

// Start a user session
router.post("/start-session", async (req, res) => {
  try {
    const { ip, location } = req.body;

    const newSession = new Analytics({
      ip,
      location,
      pagesVisited: [],
      startTime: new Date(),
    });

    const savedSession = await newSession.save();
    res.status(200).json({ message: "Session started", sessionId: savedSession._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Track page visits
router.put("/track-page", async (req, res) => {
  try {
    const { sessionId, page, duration } = req.body;

    const session = await Analytics.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    session.pagesVisited.push({ url: page, duration });
    await session.save();

    res.status(200).json({ message: "Page tracked", session });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// End a user session
router.put("/end-session", async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await Analytics.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    session.endTime = new Date();
    session.isSinglePageVisit = session.pagesVisited.length === 1;
    await session.save();

    res.status(200).json({ message: "Session ended", session });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch key metrics
router.get("/metrics", async (req, res) => {
  try {
    const bounceRate = await calculateBounceRate();
    const activity = await calculateVisitorsActivity();

    res.status(200).json({ bounceRate, activity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;