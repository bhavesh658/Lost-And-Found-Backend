const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: String,
    type: {
      type: String,
      enum: ["lost", "found"],
      required: true,
    },
    location: String,
    date: Date,
    image: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      default: "active",
    },

    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    image: {
      type: String,
      default: null,
    },

  
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);
