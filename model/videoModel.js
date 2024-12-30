const mongoose = require("mongoose");

const videoModel = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    slug: {
      type: String,
      require: true,
    },
    category: {
      type: String,
      require: true,
    },
    url: {
      type: String,
      require: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    description: {
      type: String,
    },
    thumnail: {
      type: String,
      require: true,
    },
    isYoutube: {
      type: Boolean,
      default: false,
    }
  }, { timestamps: true, }
);

const Video = mongoose.model("video", videoModel);
module.exports = Video;
