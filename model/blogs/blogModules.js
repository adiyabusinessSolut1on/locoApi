const mongoose = require('mongoose');
const { Schema } = mongoose;

const comment = new mongoose.Schema({
  comment: {
    type: String,
  },
  comment_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  }
})

const BlogSchema = new Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId },
  categoryName: { type: String },
  title: { type: String, required: true },
  slug: { type: String, require: true },
  thumnail: { type: String, require: true },
  content: { type: String, require: true },
  comments: [comment]
}, { timestamps: true });

const Blog = mongoose.model('blog', BlogSchema);

module.exports = Blog;
