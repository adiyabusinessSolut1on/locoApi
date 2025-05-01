const mongoose = require("mongoose");
const { Schema } = mongoose;

const InnerCategorySchema = new Schema({
  name: { type: String },
});

const SubSubCategorySchema = new Schema({
  name: { type: String },
  innerCategories: [InnerCategorySchema],
});

const SubCategorySchema = new Schema({
  name: { type: String },
  subSubCategories: [SubSubCategorySchema],
});

const BlogCategorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  subCategories: [SubCategorySchema],

}, { timestamps: true, });

const BlogCategory = mongoose.model("BlogCategory", BlogCategorySchema);
module.exports = BlogCategory;
