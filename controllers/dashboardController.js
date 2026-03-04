const User = require("../models/User");
const Item = require("../models/Item");
const Claim = require("../models/Claim");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalLost = await Item.countDocuments({ type: "lost" });
    const totalFound = await Item.countDocuments({ type: "found" });

    const totalResolved = await Item.countDocuments({ status: "resolved" });

    const totalClaims = await Claim.countDocuments();
    const pendingClaims = await Claim.countDocuments({ status: "pending" });

    res.json({
      totalUsers,
      totalLost,
      totalFound,
      totalResolved,
      totalClaims,
      pendingClaims,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
