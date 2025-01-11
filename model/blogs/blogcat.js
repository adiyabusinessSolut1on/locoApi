const mongoose = require('mongoose');
const { Schema } = mongoose;

const InnerCategorySchema = new Schema({
  name: { type: String  },
  blogs:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "blog",
  }]
});

const SubSubCategorySchema = new Schema({
  name: { type: String, },
  innerCategories: [InnerCategorySchema],
  blogs:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "blog",
  }]
});

const SubCategorySchema = new Schema({
  name: { type: String },
  subSubCategories: [SubSubCategorySchema],
  blogs:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "blog",
  }]
});

const UserBlogSchema = new Schema({
  name: { type: String, required: true },
  subCategories: [SubCategorySchema], 
  blogs:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "blog",
  }]
});

const UserBlogs = mongoose.model('userblog', UserBlogSchema);

module.exports = UserBlogs;
