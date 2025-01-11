const express = require("express");
const router = express.Router();

const { createMainCategory, createSubCategory, createSubSubCategory, createInnerCategory, GetBlogCategory, updateMainCategory, updateSubCategory, updateSubSubCategory, updateInnerCategory, deleteMainCategory, deleteSubCategory, deleteSubSubCategory, deleteInnerCategory, CreateBlogs, GetUserBlog, CreateNEWBlog, GetAllBlogs, DeleteBlogById, UpdateBlogById, GetBlogById, GetBlogBySlug } = require("../../controller/admin/blogs");

router.get("/blog/userblog", GetUserBlog);
router.post("/blog/create-blogs", CreateBlogs);
router.post("/blog/create", CreateNEWBlog)

router.get("/blog/getallblogs", GetAllBlogs)
router.put("/blog/update-blog/:id", UpdateBlogById);
router.delete("/blog/delete-blog/:id", DeleteBlogById);
router.get("/blog/get-blog-using-Id/:id", GetBlogById);
router.get("/blog/get-blog-by-slug/:slug", GetBlogBySlug);


router.post("/main-category", createMainCategory);
router.post("/sub-category/:mainCategoryId", createSubCategory);

router.post("/sub-sub-category/:mainCategoryId/:subCategoryId", createSubSubCategory);
router.post("/inner-category/:mainCategoryId/:subCategoryId/:subSubCategoryId", createInnerCategory);
router.get("/get-blog-category", GetBlogCategory);
router.put("/main-category/:mainCategoryId", updateMainCategory);
router.put("/sub-category/:mainCategoryId/:subCategoryId", updateSubCategory);
router.put("/sub-sub-category/:mainCategoryId/:subCategoryId/:subSubCategoryId", updateSubSubCategory);
router.put("/inner-category/:mainCategoryId/:subCategoryId/:subSubCategoryId/:innerCategoryId", updateInnerCategory);

router.delete("/main-category/:mainCategoryId", deleteMainCategory);
router.delete("/sub-category/:mainCategoryId/:subCategoryId", deleteSubCategory);
router.delete("/sub-sub-category/:mainCategoryId/:subCategoryId/:subSubCategoryId", deleteSubSubCategory);
router.delete("/inner-category/:mainCategoryId/:subCategoryId/:subSubCategoryId/:innerCategoryId", deleteInnerCategory);

module.exports = router;
