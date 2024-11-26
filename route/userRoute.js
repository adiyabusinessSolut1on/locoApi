const express = require("express");
const { isUser } = require("../middleware/rolebaseuserValidate");
const router = express.Router();
const usermiddleare = require("../middleware/accoundvalidate");
const { UserRegister, UserLogin, UpdateUserProfile, getUser, userPost, getAllPost, getAllPostByUserId, userMutualPost, getAllFormPost, getAllFormPostByUserId, getSeachMutualpostUsingwantedLobby, getSeachMutualpostUsingDvision, LikePosts, savePostInUser, removePostFromUser, CommentPost, getAllQuiz, TestComplete, UpdateTestAnswer, getSingleQuiz, getSingleTest, getAllTest, UpdateAnswer, QuizComplete, userComplteteQuiz, userComplteteTest, deleteUserAccount } = require("../controller/userController");
const { getAll } = require("../controller/admin/implinks.Controller");
const { getAllCategory, getAwarenessById, getAwarenessByCategory, } = require("../controller/admin/awaremessController");
const { GetUserBlog } = require("../controller/admin/blogs");
const { getAllcompany, getSingleProduct, getSinglecompany, getAllProsucts, } = require("../controller/admin/sponsorController");
const { getAllVideoCategory, GetVideoByCategory, GetVideoById, } = require("../controller/admin/videoController");

router.post("/register", UserRegister);
router.delete("/delete-user/:id", isUser, deleteUserAccount);
router.post("/login", UserLogin);
router.get("/get_myself", usermiddleare, getUser);
router.post("/post", usermiddleare, userPost);
router.get("/get-all-post", usermiddleare, getAllPost);
router.get("/get-post-by-user", usermiddleare, getAllPostByUserId);
router.post("/mutual-post", usermiddleare, userMutualPost);
router.get("/get-all-mutual-post", usermiddleare, getAllFormPost);
router.get("/get-all-mutual-post-byuser", usermiddleare, getAllFormPostByUserId);
router.get("/get-search/mutual-using-division", usermiddleare, getSeachMutualpostUsingDvision);
router.get("/get-search/mutual-using-wantedlobby", usermiddleare, getSeachMutualpostUsingwantedLobby);
router.put("/user/profile-update", usermiddleare, UpdateUserProfile);

// important Links
router.get("/important_link", isUser, getAll);

//awareness
router.get("/awareness/category", isUser, getAllCategory);
router.get("/awareness/:id", isUser, getAwarenessById);
router.get("/awareness/category/:category", isUser, getAwarenessByCategory);

//blog
router.get("/blog/userblog", isUser, GetUserBlog);

//sponsor
router.get("/sponsor/company", isUser, getAllcompany);
router.get("/sponsor/company/:id", isUser, getSinglecompany);
router.get("/sponsor/product", isUser, getAllProsucts);
router.get("/sponsor/product/:id", isUser, getSingleProduct);

//video
router.get("/video/get-category", isUser, getAllVideoCategory);
router.get("/video/get-video-bycategory/:category", isUser, GetVideoByCategory);
router.get("/video/get-video-byid/:id", isUser, GetVideoById);

//like and comment and save posts
router.post("/post/like/:id", isUser, LikePosts);
router.post("/post/comment/:id", isUser, CommentPost);
router.put("/savepost", isUser, savePostInUser);
router.put("/rempost", isUser, removePostFromUser)

//user Quiz
router.get("/quiz", isUser, getAllQuiz);
router.get("/quiz/:id", isUser, getSingleQuiz);
router.put("/quiz/answer/:id", isUser, UpdateAnswer);
router.put("/quiz/complete/:id", isUser, QuizComplete);

// user Test Your Self
router.get("/test", isUser, getAllTest);
router.get("/test/:id", isUser, getSingleTest);
router.put("/test/answer/:id", isUser, UpdateTestAnswer);
router.put("/test/complete/:id", isUser, TestComplete);

//user usertest and quiz

router.put("/userquiz/complete", isUser, userComplteteQuiz);
router.put("/usertest/compltete", isUser, userComplteteTest);

module.exports = router;
