// const express = require("express");
// const router = express.Router();
// const protect = require("../middleware/authMiddleware");
// const adminOnly = require("../middleware/adminMiddleware");
// const dashboardController = require("../controllers/dashboardController");

// router.get("/stats", protect, adminOnly, dashboardController.getDashboardStats);

// module.exports = router;
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const dashboardController = require("../controllers/dashboardController");

// Admin dashboard stats
router.get("/stats", protect, adminOnly,
  dashboardController.getDashboardStats
);

module.exports = router;