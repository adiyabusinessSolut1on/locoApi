const Blog = require("../model/blogs/blogModules");
const BlogCategoryModel = require("../model/blogs/blogcategoryModel");
const GetBlogByCategoryId = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const response = await Blog.find({ categoryId: categoryId }).sort({ createdAt: -1 });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const GetBlogByCategory = async (req, res) => {
    const { category } = req.params;
    try {
      const response = await Blog.find({ categoryName: category }).sort({ createdAt: -1 });
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  const GetBlogCategory = async (req, res) => {
    try {
      const response = await BlogCategoryModel.find().sort({ createdAt: -1 });
      if (!response)
        return res
          .status(404)
          .json({ success: false, message: "Category Not Found" });
  
      res.status(201).json({ success: true, data: response });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
module.exports = {GetBlogByCategoryId,GetBlogByCategory,GetBlogCategory}