const express = require("express");
const { isUser } = require("../middleware/rolebaseuserValidate");
const { GetBlogByCategoryId, GetSingleBlog, GetBlogByCategory, GetBlogCategory, getBlogsByMainCategory, searcBlog } = require("../controller/blogController")
const router = express.Router();
router.get("/getbycatid/:categoryId", GetBlogByCategoryId);
router.get("/getbycat/:category", GetBlogByCategory);
router.get("/blog-category", GetBlogCategory);
router.get("/main/cat/blog", getBlogsByMainCategory);
router.get("/search/blog", searcBlog);
router.get("/single/:id", GetSingleBlog)
module.exports = router;