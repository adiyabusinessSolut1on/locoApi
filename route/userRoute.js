const express = require("express");
const { isUser } = require("../middleware/rolebaseuserValidate");
const router = express.Router();
const usermiddleare = require("../middleware/accoundvalidate");
const {
  UserRegister,
  UserLogin,
  UpdateUserProfile,
  getUser,
  userPost,
  getAllPost,
  getAllPostByUserId,
  userMutualPost,
  getAllFormPost,
  getAllFormPostByUserId,
  getSeachMutualpostUsingwantedLobby,
  getSeachMutualpostUsingDvision,
  LikePosts,
  unLikePosts,
  savePostInUser,
  UpdateMutualPost,
  removePostFromUser,
  DeleteMutualPost,
  CommentPost,
  getAllQuiz,
  TestComplete,
  UpdateTestAnswer,
  UpdatePost,
  deletePost,
  userLikedPosts,
  getSinglePost,
  SavePosts,
  getSingleQuiz,getSingleTest,getAllTest,UpdateAnswer,QuizComplete,userComplteteQuiz,userComplteteTest
} = require("../controller/userController");
const { getAll } = require("../controller/admin/implinks.Controller");
const {
  getAllCategory,
  getAwarenessById,
  getAwarenessByCategory,
  getAll_Awareness
} = require("../controller/admin/awaremessController");
const { GetUserBlog ,AddCommentBlogById} = require("../controller/admin/blogs");
const {
  getAllcompany,
  getSingleProduct,
  getSinglecompany,
  getAllProsucts,
} = require("../controller/admin/sponsorController");
const {
  getAllVideoCategory,
  GetVideoByCategory,
  GetVideoById,
} = require("../controller/admin/videoController");

router.post("/register", UserRegister);
router.post("/login", UserLogin);
router.get("/get_myself", usermiddleare, getUser);


router.post("/mutual-post", usermiddleare, userMutualPost);
router.put("/mutual-post/:id",isUser,UpdateMutualPost);
router.delete("/mutual-post/:id",isUser,DeleteMutualPost);

router.post("/post", usermiddleare, userPost);
router.get("/get-all-post", getAllPost);
router.get("/get-post-by-user", usermiddleare, getAllPostByUserId);
router.get("/get-single-post/:id",getSinglePost)
router.put("/post/:id",isUser,UpdatePost);
router.delete("/post/:id",isUser,deletePost);

router.put("/blog/comment/:id",isUser,AddCommentBlogById);
router.get("/get-all/awareness",getAll_Awareness);
router.put("/unsave-post",isUser,removePostFromUser);
router.put("/post/unlike/:id",isUser,unLikePosts)
router.put("/post/like/:id",isUser,LikePosts);
router.post("/post/comment/:id",isUser,CommentPost);
router.put("/savepost",isUser,savePostInUser);
router.get("/saved/posts",isUser,SavePosts);
router.get("/liked/posts",isUser,userLikedPosts);



router.get("/get-all-mutual-post", usermiddleare, getAllFormPost);
router.get(
  "/get-all-mutual-post-byuser",
  usermiddleare,
  getAllFormPostByUserId
);
router.get(
  "/get-search/mutual-using-division",
  usermiddleare,
  getSeachMutualpostUsingDvision
);
router.get(
  "/get-search/mutual-using-wantedlobby",
  usermiddleare,
  getSeachMutualpostUsingwantedLobby
);
router.put("/user/profile-update", usermiddleare, UpdateUserProfile);

// important Links
router.get("/important_link", getAll);

//awareness
router.get("/awareness/category", getAllCategory);
router.get("/awareness/:id", getAwarenessById);
router.get("/awareness/category/:category", getAwarenessByCategory);

//blog
router.get("/blog/userblog",  GetUserBlog);

//sponsor
router.get("/sponsor/company", getAllcompany);
router.get("/sponsor/company/:id", getSinglecompany);
router.get("/sponsor/product", getAllProsucts);
router.get("/sponsor/product/:id", getSingleProduct);

//video
router.get("/video/get-category", getAllVideoCategory);
router.get("/video/get-video-bycategory/:category", GetVideoByCategory);
router.get("/video/get-video-byid/:id", GetVideoById);




//user Quiz
router.get("/quiz",isUser,getAllQuiz);
router.get("/quiz/:id",isUser,getSingleQuiz);
router.put("/quiz/answer/:id",isUser,UpdateAnswer);
router.put("/quiz/complete/:id",isUser,QuizComplete);

// user Test Your Self
router.get("/test", isUser, getAllTest);
router.get("/test/:id", isUser, getSingleTest);
router.put("/test/answer/:id",isUser,UpdateTestAnswer);
router.put("/test/complete/:id",isUser,TestComplete);

//user usertest and quiz

router.put("/userquiz/complete",isUser,userComplteteQuiz);
router.put("/usertest/compltete",isUser,userComplteteTest);

module.exports = router;
