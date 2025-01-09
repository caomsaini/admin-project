const Analytics = require("../models/Analytics");

const calculateBounceRate = async () => {
  const totalSessions = await Analytics.countDocuments();
  const singlePageSessions = await Analytics.countDocuments({ isSinglePageVisit: true });

  const bounceRate = totalSessions ? (singlePageSessions / totalSessions) * 100 : 0;
  return bounceRate.toFixed(2);
};

const calculateSessionDuration = (session) => {
  if (!session.endTime) return 0;
  const duration = (new Date(session.endTime) - new Date(session.startTime)) / 1000; // Duration in seconds
  return duration.toFixed(2);
};

const calculateVisitorsActivity = async () => {
  const sessions = await Analytics.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$startTime" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return sessions;
};

module.exports = { calculateBounceRate, calculateSessionDuration, calculateVisitorsActivity };