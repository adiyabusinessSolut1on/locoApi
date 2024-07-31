const express = require("express");
const { isUser } = require("../middleware/rolebaseuserValidate");
const {GetBlogByCategoryId,GetBlogByCategory,GetBlogCategory}=require("../controller/blogController")
const router = express.Router();
router.get("/getbycatid/:categoryId",GetBlogByCategoryId)
router.get("/getbycat/:category",GetBlogByCategory)
router.get("/blog-category",GetBlogCategory)
module.exports = router;