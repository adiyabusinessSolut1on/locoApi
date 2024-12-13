const mongoose = require("mongoose");

const comment = new mongoose.Schema({
  comment: {
    type: String,
  },
  comment_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  }
})
const postModel = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    type: {
      type: String,
      default: "post"
    },
    images: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
    }],
    videos: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
    }],
    content: {
      type: String,
    },
    like: {
      type: Number,
    },
    comments: [comment],
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("post", postModel);
module.exports = Post;