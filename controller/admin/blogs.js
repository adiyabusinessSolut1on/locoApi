const BlogCategoryModel = require("../../model/blogs/blogcategoryModel");
const UserBlogs = require("../../model/blogs/blogcat");
const Blog = require("../../model/blogs/blogModules");
const { sendMessage } = require("../../services/notification");
const { sendNotifcationToAllUsers } = require("../notification");

const createMainCategory = async (req, res) => {
  try {

    const { name } = req.body;
    const mainCategory = new BlogCategoryModel({ name });
    await mainCategory.save();
    res.status(201).json({ success: true, data: mainCategory, message: "category created" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createSubCategory = async (req, res) => {
  try {
    const { mainCategoryId } = req.params;
    const { name } = req.body;
    const mainCategory = await BlogCategoryModel.findById(mainCategoryId);
    if (!mainCategory)
      return res
        .status(404)
        .json({ success: false, message: "Main Category not found" });

    mainCategory.subCategories.push({ name });
    await mainCategory.save();
    res.status(201).json({ success: true, data: mainCategory, message: "Sub Category saved" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createSubSubCategory = async (req, res) => {
  try {
    const { mainCategoryId, subCategoryId } = req.params;
    const { name } = req.body;
    const mainCategory = await BlogCategoryModel.findById(mainCategoryId);
    if (!mainCategory)
      return res
        .status(404)
        .json({ success: false, message: "Main Category not found" });

    const subCategory = mainCategory.subCategories.id(subCategoryId);
    if (!subCategory)
      return res
        .status(404)
        .json({ success: false, message: "Sub Category not found" });

    subCategory.subSubCategories.push({ name });
    await mainCategory.save();
    res.status(201).json({ success: true, data: mainCategory, message: "Saved Sub Sub-category" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createInnerCategory = async (req, res) => {
  try {
    const { mainCategoryId, subCategoryId, subSubCategoryId } = req.params;
    const { name } = req.body;
    const mainCategory = await BlogCategoryModel.findById(mainCategoryId);
    if (!mainCategory)
      return res
        .status(404)
        .json({ success: false, message: "Main Category not found" });

    const subCategory = mainCategory.subCategories.id(subCategoryId);
    if (!subCategory)
      return res
        .status(404)
        .json({ success: false, message: "Sub Category not found" });

    const subSubCategory = subCategory.subSubCategories.id(subSubCategoryId);
    if (!subSubCategory)
      return res
        .status(404)
        .json({ success: false, message: "Sub Sub-Category not found" });

    subSubCategory.innerCategories.push({ name });
    await mainCategory.save();
    res.status(200).json({ success: true, data: mainCategory, message: "inner category saved" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateMainCategory = async (req, res) => {
  try {
    const { mainCategoryId } = req.params;
    const { name } = req.body;
    const mainCategory = await BlogCategoryModel.findByIdAndUpdate(
      mainCategoryId,
      { name },
      { new: true }
    );
    if (!mainCategory)
      return res.status(404).json({ message: "Main Category not found" });
    res.status(200).json({ success: true, message: "Main Category updated", data: mainCategory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSubCategory = async (req, res) => {
  try {
    const { mainCategoryId, subCategoryId } = req.params;
    const { name } = req.body;
    const mainCategory = await BlogCategoryModel.findById(mainCategoryId);
    if (!mainCategory)
      return res.status(404).json({ success: false, message: "Main Category not found" });

    const subCategory = mainCategory.subCategories.id(subCategoryId);
    if (!subCategory)
      return res.status(404).json({ success: false, message: "Sub Category not found" });

    subCategory.name = name;
    await mainCategory.save();
    res.status(200).json({ success: true, data: mainCategory, message: "Sub Category Update" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSubSubCategory = async (req, res) => {
  try {
    const { mainCategoryId, subCategoryId, subSubCategoryId } = req.params;
    const { name } = req.body;
    const mainCategory = await BlogCategoryModel.findById(mainCategoryId);
    if (!mainCategory)
      return res.status(404).json({ success: false, message: "Main Category not found" });

    const subCategory = mainCategory.subCategories.id(subCategoryId);
    if (!subCategory)
      return res.status(404).json({ success: false, message: "Sub Category not found" });

    const subSubCategory = subCategory.subSubCategories.id(subSubCategoryId);
    if (!subSubCategory)
      return res.status(404).json({ success: false, message: "Sub Sub-Category not found" });

    subSubCategory.name = name;
    await mainCategory.save();
    res.status(203).json({ success: true, data: mainCategory, message: "Sub Sub-Category Updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateInnerCategory = async (req, res) => {
  try {
    const { mainCategoryId, subCategoryId, subSubCategoryId, innerCategoryId } =
      req.params;
    const { name } = req.body;
    const mainCategory = await BlogCategoryModel.findById(mainCategoryId);
    if (!mainCategory)
      return res.status(404).json({ success: false, message: "Main Category not found" });

    const subCategory = mainCategory.subCategories.id(subCategoryId);
    if (!subCategory)
      return res.status(404).json({ success: false, message: "Sub Category not found" });

    const subSubCategory = subCategory.subSubCategories.id(subSubCategoryId);
    if (!subSubCategory)
      return res.status(404).json({ success: false, message: "Sub Sub-Category not found" });

    const innerCategory = subSubCategory.innerCategories.id(innerCategoryId);
    if (!innerCategory)
      return res.status(404).json({ success: false, message: "Inner Category not found" });

    innerCategory.name = name;
    await mainCategory.save();
    res.status(200).json({ success: true, data: mainCategory, message: "inner category updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMainCategory = async (req, res) => {
  try {
    const { mainCategoryId } = req.params;
    const mainCategory = await BlogCategoryModel.findByIdAndDelete(
      mainCategoryId
    );
    if (!mainCategory)
      return res.status(404).json({ success: false, message: "Main Category not found" });
    res.status(200).json({ success: true, message: "Main Category deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSubCategory = async (req, res) => {
  try {
    const { mainCategoryId, subCategoryId } = req.params;
    const mainCategory = await BlogCategoryModel.findById(mainCategoryId);
    if (!mainCategory)
      return res.status(404).json({ success: false, message: "Main Category not found" });

    const subCategory = mainCategory.subCategories.id(subCategoryId);
    if (!subCategory)
      return res.status(404).json({ success: false, message: "Sub Category not found" });

    subCategory.deleteOne();
    await mainCategory.save();
    res.status(200).json({ success: true, message: "sub category deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSubSubCategory = async (req, res) => {
  try {
    const { mainCategoryId, subCategoryId, subSubCategoryId } = req.params;
    const mainCategory = await BlogCategoryModel.findById(mainCategoryId);
    if (!mainCategory)
      return res.status(404).json({ success: false, message: "Main Category not found" });

    const subCategory = mainCategory.subCategories.id(subCategoryId);
    if (!subCategory)
      return res.status(404).json({ success: false, message: "Sub Category not found" });

    const subSubCategory = subCategory.subSubCategories.id(subSubCategoryId);
    if (!subSubCategory)
      return res.status(404).json({ success: false, message: "Sub Sub-Category not found" });

    subSubCategory.deleteOne();
    await mainCategory.save();
    res.status(200).json({ success: true, message: "Sub Sub-Category deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteInnerCategory = async (req, res) => {
  try {
    const { mainCategoryId, subCategoryId, subSubCategoryId, innerCategoryId } =
      req.params;
    const mainCategory = await BlogCategoryModel.findById(mainCategoryId);
    if (!mainCategory)
      return res.status(404).json({ success: false, message: "Main Category not found" });

    const subCategory = mainCategory.subCategories.id(subCategoryId);
    if (!subCategory)
      return res.status(404).json({ success: false, message: "Sub Category not found" });

    const subSubCategory = subCategory.subSubCategories.id(subSubCategoryId);
    if (!subSubCategory)
      return res.status(404).json({ success: false, message: "Sub Sub-Category not found" });

    const innerCategory = subSubCategory.innerCategories.id(innerCategoryId);
    if (!innerCategory)
      return res.status(404).json({ success: false, message: "Inner Category not found" });

    innerCategory.deleteOne();
    await mainCategory.save();
    res.status(200).json({ success: true, message: "inner category deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

const createBlogMainCategory = async (req, res) => {
  try {
    const { maincategory, title, slug, thumnail, content } = req.body;
    const userBlog = await UserBlogs.findOneAndUpdate(
      {
        name: maincategory,
      },

      {
        $setOnInsert: { name: maincategory },
      },
      {
        upsert: true,
        new: true,
      }
    );
    const blog = await Blog.create({
      title: title,
      slug: slug,
      thumnail: thumnail,
      content: content,
    });
    userBlog.blogs.push(blog._id);
    await userBlog.save();
    res.status(201).json(userBlog);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createBlogSubCategory = async (req, res) => {
  try {
    const { maincategory, subcategory, title, slug, thumnail, content } =
      req.body;
    const userBlog = await UserBlogs.findOneAndUpdate(
      {
        name: maincategory,
      },

      {
        $setOnInsert: { name: maincategory },
      },
      {
        upsert: true,
        new: true,
      }
    );
    let subCatIndex = userBlog?.subCategories.findIndex(
      (cat) => cat.name == subcategory
    );

    if (subCatIndex === -1) {
      userBlog.subCategories.push({ name: subcategory, subSubCategories: [] });
      subCatIndex = userBlog.subCategories.length - 1;
    }

    const blog = await Blog.create({
      title: title,
      slug: slug,
      thumnail: thumnail,
      content: content,
    });

    userBlog.subCategories[subCatIndex].blogs.push(blog._id);
    await userBlog.save();
    res.status(201).json(userBlog);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const createBlogSubSubCategory = async (req, res) => {
  try {
    const {
      maincategory,
      subcategory,
      subsubcategory,
      title,
      slug,
      thumnail,
      content,
    } = req.body;

    const userBlog = await UserBlogs.findOneAndUpdate(
      {
        name: maincategory,
      },

      {
        $setOnInsert: { name: maincategory },
      },
      {
        upsert: true,
        new: true,
      }
    );

    let subCatIndex = userBlog?.subCategories.findIndex(
      (cat) => cat.name === subcategory
    );

    if (subCatIndex === -1) {
      userBlog.subCategories.push({ name: subcategory });
      subCatIndex = userBlog.subCategories.length - 1;
    }

    let subSubCatIndex = userBlog?.subCategories[
      subCatIndex
    ]?.subSubCategories.findIndex((subCat) => subCat.name === subsubcategory);

    if (subSubCatIndex === -1) {
      userBlog.subCategories[subCatIndex].subSubCategories.push({
        name: subsubcategory,
      });
      subSubCatIndex =
        userBlog.subCategories[subCatIndex].subSubCategories.length - 1;
    }

    const blog = await Blog.create({
      title: title,
      slug: slug,
      thumnail: thumnail,
      content: content,
    });

    userBlog.subCategories[subCatIndex].subSubCategories[
      subSubCatIndex
    ].blogs.push(blog._id);
    await userBlog.save();

    res.status(201).json(userBlog);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const createBlogInnerCategory = async (req, res) => {
  try {
    const {
      maincategory,
      subcategory,
      subsubcategory,
      innercategory,
      title,
      slug,
      thumnail,
      content,
    } = req.body;

    const userBlog = await UserBlogs.findOneAndUpdate(
      { name: maincategory },
      { $setOnInsert: { name: maincategory } },
      { upsert: true, new: true }
    );

    let subCatIndex = userBlog?.subCategories.findIndex(
      (cat) => cat.name === subcategory
    );
    if (subCatIndex === -1) {
      userBlog.subCategories.push({
        name: subcategory,
        subSubCategories: [],
        contents: [],
      });
      subCatIndex = userBlog.subCategories.length - 1;
    }

    let subSubCatIndex = userBlog?.subCategories[
      subCatIndex
    ]?.subSubCategories.findIndex((subCat) => subCat.name === subsubcategory);
    if (subSubCatIndex === -1) {
      userBlog.subCategories[subCatIndex].subSubCategories.push({
        name: subsubcategory,
        innerCategories: [],
        contents: [],
      });
      subSubCatIndex =
        userBlog.subCategories[subCatIndex].subSubCategories.length - 1;
    }

    let innerCatIndex = userBlog?.subCategories[subCatIndex]?.subSubCategories[
      subSubCatIndex
    ]?.innerCategories.findIndex((innerCat) => innerCat.name === innercategory);
    if (innerCatIndex === -1) {
      userBlog.subCategories[subCatIndex].subSubCategories[
        subSubCatIndex
      ].innerCategories.push({ name: innercategory, contents: [] });
      innerCatIndex =
        userBlog.subCategories[subCatIndex].subSubCategories[subSubCatIndex]
          .innerCategories.length - 1;
    }

    const blog = await Blog.create({
      title,
      slug,
      thumnail,
      content,
    });

    userBlog.subCategories[subCatIndex].subSubCategories[
      subSubCatIndex
    ].innerCategories[innerCatIndex].blogs.push(blog._id);
    await userBlog.save();

    res.status(201).json(userBlog);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const CreateBlogs = async (req, res) => {
  const {
    maincategory,
    subcategory,
    subsubcategory,
    innercategory,
    title,
    slug,
    thumnail,
    content,
  } = req.body;

  try {
    // console.log("thumbnail>>", thumnail)
    const userBlog = await UserBlogs.findOneAndUpdate({ name: maincategory }, { $setOnInsert: { name: maincategory } }, { upsert: true, new: true });

    const findOrCreateCategory = (categories, categoryName) => {
      let categoryIndex = categories.findIndex(
        (cat) => cat.name === categoryName
      );

      if (categoryIndex === -1) {
        categories.push({ name: categoryName, });
        categoryIndex = categories.length - 1;
      }
      return categoryIndex;
    };

    let subCatIndex = subcategory ? findOrCreateCategory(userBlog.subCategories, subcategory) : null;

    let subSubCatIndex = subsubcategory ? findOrCreateCategory(userBlog.subCategories[subCatIndex].subSubCategories, subsubcategory) : null;

    let innerCatIndex = innercategory ? findOrCreateCategory(userBlog.subCategories[subCatIndex].subSubCategories[subSubCatIndex].innerCategories, innercategory) : null;

    const blog = await Blog.create({ title, slug, thumnail, content });

    if (innerCatIndex !== null) {
      userBlog.subCategories[subCatIndex].subSubCategories[
        subSubCatIndex
      ].innerCategories[innerCatIndex].blogs.push(blog._id);
    } else if (subSubCatIndex !== null) {
      userBlog.subCategories[subCatIndex].subSubCategories[
        subSubCatIndex
      ].blogs.push(blog._id);
    } else if (subCatIndex !== null) {
      userBlog.subCategories[subCatIndex].blogs.push(blog._id);
    } else {
      userBlog.blogs.push(blog._id);
    }

    await userBlog.save();

    const admin = await User.findOne({ role: 'admin' })

    await sendNotifcationToAllUsers(title, content, "blog", admin?._id, thumnail)
    // sendMessage(sender, reciver, title, content, "blog")

    res.status(201).json({ success: true, data: userBlog, message: "Blog Created" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const GetUserBlog = async (req, res) => {
  try {
    const userBlog = await UserBlogs.find()
      .populate({ path: "subCategories.blogs", model: "blog", })
      .populate({ path: "subCategories.subSubCategories.blogs", model: "blog", })
      .populate({ path: "subCategories.subSubCategories.innerCategories.blogs", model: "blog", })
      .populate({ path: "blogs", model: "blog", });
    if (!userBlog.length > 0) {
      return res.status(404).json("User Blog Not Found");
    }
    res.status(200).json(userBlog);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const GetAllBlogs = async (req, res) => {
  try {
    const response = await Blog.find();
    if (response.length < 1) {
      return res.status(404).json({ success: false, message: " Blog Not Found" });
    }
    return res.status(200).json({ success: true, data: response });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const UpdateBlogById = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const response = await Blog.findByIdAndUpdate(
      id,
      {
        ...data,
      },
      { new: true }
    );
    if (!response) {
      res.status(403).json({ success: false, message: " Blog Not Updated" });
    }
    res.status(200).json({ success: true, data: response, message: 'blog Updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const DeleteBlogById = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await Blog.findByIdAndDelete(id);
    if (!response) {
      return res
        .status(404)
        .json({ succcess: false, message: " Blog Not Found" });
    }
    res.status(200).json({ success: true, message: "Blog Delete" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const GetBlogById = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await Blog.findById(id);
    if (!response) {
      res.status(404).json(" Blog Not Found");
    }
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const GetBlogBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const response = await Blog.findOne({ slug: slug });
    if (!response) {
      res.status(404).json(" Blog Not Found");
    }
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = {
  createMainCategory,
  createSubCategory,
  createSubSubCategory,
  createInnerCategory,
  GetBlogCategory,
  updateMainCategory,
  updateSubCategory,
  updateSubSubCategory,
  updateInnerCategory,
  deleteMainCategory,
  deleteSubCategory,
  deleteSubSubCategory,
  deleteInnerCategory,
  createBlogMainCategory,
  createBlogSubCategory,
  createBlogSubSubCategory,
  createBlogSubSubCategory,
  createBlogInnerCategory,
  CreateBlogs,
  GetUserBlog,
  GetAllBlogs,
  DeleteBlogById,
  UpdateBlogById,
  GetBlogById,
  GetBlogBySlug,
};
