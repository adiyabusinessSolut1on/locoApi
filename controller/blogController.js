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
const getBlogsByMainCategory = async (req, res) => {
  try {
    const categories = await BlogCategoryModel.find()
      .select('name subCategories')
      .lean();

    const categoryBlogs = await Promise.all(categories.map(async (category) => {
      const subCategoryIds = category.subCategories.map(subCat => subCat._id);
      const subSubCategoryIds = category.subCategories.flatMap(subCat => 
        subCat.subSubCategories.map(subSubCat => subSubCat._id)
      );
      const blogs = await Blog.find({
        $or: [
          { categoryId: category._id },
          { categoryId: { $in: subCategoryIds } },
          { categoryId: { $in: subSubCategoryIds } }, 
        ]
      }).select('title slug thumbnail content comments') 
        .sort({ createdAt: -1 }).limit(10).lean();

      return {
        category: category.name,
        blogs, 
      };
    }));

    res.status(200).json(categoryBlogs);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error, please try again later',
    });
  }
};

  
module.exports = {GetBlogByCategoryId,GetBlogByCategory,GetBlogCategory,getBlogsByMainCategory}