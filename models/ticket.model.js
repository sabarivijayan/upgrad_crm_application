const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  ticketPriority: {
    type: Number,
    required: true,
    default: 4,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "open",
  },
  reporter: {
    type: String,
  },
  assignee: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: () => {
      return Date.now();
    },
    immutable: true,
  },
  updatedAt: {
    type: Date,
    default: () => {
      return Date.now();
    },
  }
});

module.exports = mongoose.model("Ticket", ticketSchema);