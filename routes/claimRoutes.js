const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const claimController = require("../controllers/claimController");

// ================= MULTER SETUP FOR PROOFS =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Same folder as items for simplicity
  },
  filename: (req, file, cb) => {
    // Unique name for proof images
    cb(null, "proof-" + Date.now() + "-" + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  },
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit for proof images
});

// ================= ROUTES =================

// User create claim (Ab isme upload.single("proofImage") add kar diya)
router.post("/create", protect, upload.single("proofImage"), claimController.createClaim);

// User claims
router.get("/my-claims", protect, claimController.getMyClaims);

// Admin get all claims
router.get("/all", protect, adminOnly, claimController.getAllClaims);

// Admin approve / reject
router.put("/:id", protect, adminOnly, claimController.updateClaimStatus);

module.exports = router;