const Blog = require("../model/blogs/blogModules");
const BlogCategoryModel = require("../model/blogs/blogcategoryModel");
const GetBlogByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params;
    if (!categoryId) {
      return res.status(400).json({ success: false, message: 'Category ID is required' });
    }
    const blogs = await Blog.find({ categoryId })
      .sort('-createdAt') 
      .populate('comments.comment_user', 'name email image')
      .lean();

    res.status(200).json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error.message || error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const GetBlogByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    if (!category) {
      return res.status(400).json({ success: false, message: 'Category is required' });
    }
    const blogs = await Blog.find({ categoryName: category })
      .sort('-createdAt')
      .populate('comments.comment_user', 'name email image')
      .lean();
    res.set('Cache-Control', 'public, max-age=300');

    res.status(200).json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error.message || error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const GetBlogCategory = async (req, res) => {
  try {
    const categories = await BlogCategoryModel.find().sort("-createdAt").lean();
    res.set("Cache-Control", "public, max-age=300");
    return res.status(200).json(categories);
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Server error, please try again later",
      });
  }
};

  
module.exports = {GetBlogByCategoryId,GetBlogByCategory,GetBlogCategory}