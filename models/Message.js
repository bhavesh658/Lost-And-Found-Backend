const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  roomId: { 
    type: String, // Ye aapki Item ID hogi
    required: true 
  },
  sender: { 
    type: String, 
    required: true 
  },
  text: { 
    type: String, 
    required: true 
  },
  time: { 
    type: String 
  }
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);