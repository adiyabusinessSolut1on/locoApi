const mongoose = require("mongoose");

const videoCategoryModel = new mongoose.Schema(
  {
    category: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const VideoCategory = mongoose.model("videocategory", videoCategoryModel);
module.exports = VideoCategory;
