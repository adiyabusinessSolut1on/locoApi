const Blog = require("../model/blogs/blogModules");
const BlogCategoryModel = require("../model/blogs/blogcategoryModel");
const GetBlogByCategoryId = async (req, res) => {
  const { categoryId } = req.params;
  // console.log("categoryId", categoryId);

  try {
    if (!categoryId) {
      return res.status(400).json({ success: false, message: 'Category ID is required' });
    }
    const blogs = await Blog.find({ categoryId }).populate('comments.comment_user', 'name email image').lean();
    // console.log("blogs: ", blogs.length);

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
    const blogs = await Blog.find({ categoryName: category }).populate('comments.comment_user', 'name email image').lean();
    res.status(200).json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error.message || error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const GetSingleBlog = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Id is Required' });
    }
    const response = await Blog.findById(id);

    if (!response) {
      return res.status(403).json({ success: false, message: "Blog Not Found" })
    }
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    console.error('Error fetching blogs:', error.message || error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const GetBlogCategory = async (req, res) => {
  try {
    const categories = await BlogCategoryModel.find().lean();
    res.set("Cache-Control", "public, max-age=300");
    // return res.status(200).json(categories);
    return res.status(200).json({ message: "Ok", data: categories, success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error, please try again later", });
  }
};

const getBlogsByMainCategory = async (req, res) => {
  // console.log("============================================ getBlogsByMainCategory ============================================");

  try {
    const categories = await BlogCategoryModel.find().select('name subCategories image').lean();
    const categoryBlogs = await Promise.all(categories.map(async (category) => {
      const subCategoryIds = category.subCategories.map(subCat => subCat._id);
      const subSubCategoryIds = category.subCategories.flatMap(subCat =>
        subCat.subSubCategories.map(subSubCat => subSubCat._id)
      );
      const blogs = await Blog.find({ $or: [{ categoryId: category._id }, { categoryId: { $in: subCategoryIds } }, { categoryId: { $in: subSubCategoryIds } },] }).select('title slug thumnail content').sort({ createdAt: -1 }).limit(10).lean();

      return { name: category.name, blogs, };
    }));

    res.status(200).json(categoryBlogs);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error, please try again later', });
  }
};
const searcBlog = async (req, res) => {

  try {
    const searchTerm = req.query.q;
    const menus = await Blog.find({ $or: [{ title: { $regex: searchTerm, $options: "i" } }], });
    res.status(200).json(menus);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
}

module.exports = { GetBlogByCategoryId, GetBlogByCategory, GetBlogCategory, getBlogsByMainCategory, searcBlog, GetSingleBlog }