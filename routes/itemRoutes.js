const express = require("express");
const router = express.Router();
const multer = require("multer"); 
const path = require("path");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const itemController = require("../controllers/itemController");

// ================= MULTER CONFIGURATION =================
// 1. Storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    // Unique filename banane ke liye: Timestamp + Random Number + Extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// 2. File Filter (Optional but recommended: Sirf images allow karne ke liye)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"), false);
  }
};

// 3. Final Upload Middleware
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// ================= ROUTES =================

// Create item: 'upload.single("image")' zaroori hai
router.post("/create", protect, upload.single("image"), itemController.createItem);

// Logged user items
router.get("/myitems", protect, itemController.getMyItems);

// User stats
router.get("/user-stats", protect, itemController.getUserStats);

// All items (visible to all)
router.get("/all", itemController.getAllItems);

// item get by id 
router.get("/:id", itemController.getItemById);

// Update item
router.put("/:id", protect, itemController.updateItem);

// User delete own item
router.delete("/:id", protect, itemController.deleteItem);

// Admin delete any item
router.delete("/admin/:id", protect, adminOnly, itemController.adminDeleteItem);

module.exports = router;