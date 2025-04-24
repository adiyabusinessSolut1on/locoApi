const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  reportedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    // required: true,
  },
  reportedPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "post",
  },
  awareness: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "awareness",
  },
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "blog",
  },
  reason: {
    type: String,
    required: true,
    enum: ["Spam", "Inappropriate Content", "Harassment", "Other"],
  },
  description: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ["Pending", "Reviewed", "Resolved"],
    default: "Pending",
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "community",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Report", reportSchema);
