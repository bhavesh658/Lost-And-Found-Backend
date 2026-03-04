const Item = require("../models/Item");

exports.createItem = async (req, res) => {
  try {
    // 1. Text data req.body se nikalenge
    const { title, description, category, type, location, date } = req.body;
    
    // 2. Image path req.file se nikalenge (Multer ki wajah se req.file banta hai)
    // Hum sirf path save karenge database mein
    let imagePath = null;
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    const item = await Item.create({
      title,
      description,
      category,
      type,
      location,
      date,
      image: imagePath, // Database mein path save ho raha hai
      user: req.user.id, // Auth middleware se user id
    });

    res.status(201).json({ 
        message: "Item created successfully ✅",
        item 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Owner check (req.user._id ensure karein ki auth middleware se sahi aa raha hai)
    const userId = req.user.id || req.user._id;
    if (item.user.toString() !== userId.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this item" });
    }

    // Agar image bhi update ho rahi hai toh req.file check karna padega (future scope)
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const userId = req.user.id || req.user._id;
    if (item.user.toString() !== userId.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this item" });
    }

    await item.deleteOne();
    res.json({ message: "Item deleted successfully ✅" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const lostItems = await Item.countDocuments({ user: req.user.id, type: "lost" });
    const foundItems = await Item.countDocuments({ user: req.user.id, type: "found" });
    const recovered = await Item.countDocuments({ user: req.user.id, status: "recovered" });
    const matches = await Item.countDocuments({ user: req.user.id, status: "matched" });

    res.json({ lostItems, foundItems, recovered, matches });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.adminDeleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item deleted by Admin ✅" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("user", "name email");
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};