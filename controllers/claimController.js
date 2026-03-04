const Claim = require("../models/Claim");
const Item = require("../models/Item");

// 🔹 Create Claim (With Proof Image)
exports.createClaim = async (req, res) => {
  try {
    const { itemId, message } = req.body;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // ⭐ IMPORTANT CHECK: User apne hi post kiye huye item ko claim nahi kar sakta
    if (item.user.toString() === req.user.id.toString()) {
      return res.status(400).json({ 
        message: "You cannot claim an item that you reported yourself!" 
      });
    }

    // Pehle se claim kiya hai ya nahi check karein
    const existingClaim = await Claim.findOne({ item: itemId, user: req.user.id });
    if (existingClaim) {
      return res.status(400).json({ message: "You have already sent a request for this item!" });
    }

    const proofImagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const claim = await Claim.create({
      item: itemId,
      user: req.user.id,
      message,
      proofImage: proofImagePath, 
    });

    res.status(201).json({ message: "Request Sent Successfully ✅", claim });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Admin Approve / Reject (Same as your logic)
exports.updateClaimStatus = async (req, res) => {
  try {
    const { status } = req.body; 

    const claim = await Claim.findById(req.params.id);
    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    claim.status = status;
    await claim.save();

    if (status === "approved") {
      // Item status update
      await Item.findByIdAndUpdate(claim.item, {
        status: "recovered",
        claimedBy: claim.user, 
      });

      // Reject all other pending claims for this specific item
      await Claim.updateMany(
        {
          item: claim.item,
          _id: { $ne: claim._id },
          status: "pending" // Sirf pending waalon ko reject karein
        },
        { status: "rejected" }
      );
    }

    res.json({ message: `Claim ${status} successfully`, claim });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get All Claims (Admin Only)
exports.getAllClaims = async (req, res) => {
  try {
    const claims = await Claim.find()
      .populate("user", "name email")
      .populate("item", "title type location status image") 
      .sort({ createdAt: -1 });

    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get Logged-in User Claims
exports.getMyClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ user: req.user.id })
      .populate("item", "title type location status image")
      .sort({ createdAt: -1 });

    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};