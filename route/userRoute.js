const express = require("express");
const { isUser } = require("../middleware/rolebaseuserValidate");
const router = express.Router();
const usermiddleare = require("../middleware/accoundvalidate");
const { UserRegister, UserLogin, UpdateUserProfile, getUser, userPost, getAllPost, getAllPostByUserId, userMutualPost, getAllFormPost, getAllFormPostByUserId, getSeachMutualpostUsingwantedLobby, getSeachMutualpostUsingDvision, LikePosts, unLikePosts, savePostInUser, UpdateMutualPost, removePostFromUser, DeleteMutualPost, CommentPost, getAllQuiz, TestComplete, UpdateTestAnswer, UpdatePost, deletePost, userLikedPosts, getSinglePost, SavePosts, getSingleQuiz, getSingleTest, getAllTest, UpdateAnswer, QuizComplete, userComplteteQuiz, userComplteteTest, deleteUserAccount, UpdateImagePost, deleteImagePost, UserForgotPassword, userInfo, followOtherUser, blockAndUnblockUser, getAllFollwingUser, getAllFollowerUser, blockedUser, getRandomUser, getAllQuizPagination, getRandomOneQuiz, getSingleMutualPostById } = require("../controller/userController");
const { getAll, getAllPagination, getSingle } = require("../controller/admin/implinks.Controller");
const { getAllCategory, getAwarenessById, getAwarenessByCategory, getAll_Awareness, getSingleAwareness, getAllAwarenessPagination, getAwarenessByCategoryById, getIdFirstAwareness } = require("../controller/admin/awaremessController");
const { GetUserBlog, AddCommentBlogById } = require("../controller/admin/blogs");
const { getAllcompany, getSingleProduct, getSinglecompany, getAllProsucts, } = require("../controller/admin/sponsorController");
const { getAllVideoCategory, GetVideoByCategory, GetVideoById, } = require("../controller/admin/videoController");

router.post("/register", UserRegister);
// my changes start
router.delete("/delete-user/:id", isUser, deleteUserAccount);
// my changes end
router.post("/login", UserLogin);
router.get("/get_myself", usermiddleare, getUser);

router.post("/forgot-password", UserForgotPassword)


router.get('/userInfo/:id', isUser, userInfo)


router.get("/mutual-post-byId/:id", isUser, getSingleMutualPostById);
router.post("/mutual-post", usermiddleare, userMutualPost);
router.put("/mutual-post/:id", isUser, UpdateMutualPost);
router.delete("/mutual-post/:id", isUser, DeleteMutualPost);

// this api need to check
router.post("/post", usermiddleare, userPost);
router.get("/get-all-post", getAllPost);
router.get("/get-post-by-user", usermiddleare, getAllPostByUserId);
router.get("/get-single-post/:id", getSinglePost)
router.put("/post/:id", isUser, UpdatePost);
router.put("/post/image/:id", isUser, UpdateImagePost)
router.delete("/post/:id", isUser, deletePost);
router.post("/post/delete/image/:id", isUser, deleteImagePost);

router.put("/blog/comment/:id", isUser, AddCommentBlogById);
router.get("/get-all/awareness", getAll_Awareness);
router.get("/get-single/awareness/:id", getSingleAwareness);
router.put("/unsave-post", isUser, removePostFromUser);
router.put("/post/unlike/:id", isUser, unLikePosts);
router.put("/post/like/:id", isUser, LikePosts);
router.post("/post/comment/:id", isUser, CommentPost);
router.put("/savepost", isUser, savePostInUser);
router.get("/saved/posts", isUser, SavePosts);
router.get("/liked/posts", isUser, userLikedPosts);

router.get("/get-all-mutual-post", usermiddleare, getAllFormPost);
router.get("/get-all-mutual-post-byuser", usermiddleare, getAllFormPostByUserId);
router.get("/get-search/mutual-using-division", usermiddleare, getSeachMutualpostUsingDvision);
router.get("/get-search/mutual-using-wantedlobby", usermiddleare, getSeachMutualpostUsingwantedLobby);
router.put("/user/profile-update", usermiddleare, UpdateUserProfile);

// important Links
router.get("/important_link", getAll);
router.get("/importants", getAllPagination);
router.get("/important_link/:id", getSingle);

//awareness
router.get('/latest/awareness/:id', getIdFirstAwareness)
router.get('/pagination/awareness', getAllAwarenessPagination)
router.get("/awareness/category", getAllCategory);
router.get("/awareness/:id", getAwarenessById);
router.get("/awareness/category/:category", getAwarenessByCategory);
// router.get("/awareness/category/:id", getAwarenessByCategoryById);

//blog
router.get("/blog/userblog", GetUserBlog);

//sponsor
router.get("/sponsor/company", getAllcompany);
router.get("/sponsor/company/:id", getSinglecompany);
router.get("/sponsor/product", getAllProsucts);
router.get("/sponsor/product/:id", getSingleProduct);

//video
router.get("/video/get-category", getAllVideoCategory);
router.get("/video/get-video-bycategory/:category", GetVideoByCategory);
router.get("/video/get-video-byid/:id", GetVideoById);

// my chnages start
router.put("/rempost", isUser, removePostFromUser)

// my changes end


//user Quiz
router.get("/quiz", isUser, getAllQuiz);
router.get("/quizSingle", isUser, getRandomOneQuiz);
router.get("/quizPagination", isUser, getAllQuizPagination);
router.get("/quiz/:id", isUser, getSingleQuiz);
router.put("/quiz/answer/:id", isUser, UpdateAnswer);
router.put("/quiz/complete/:id", isUser, QuizComplete);

// user Test Your Self
router.get("/test", isUser, getAllTest);
router.get("/test/:id", isUser, getSingleTest);
router.put("/test/answer/:id", isUser, UpdateTestAnswer);
router.put("/test/complete/:id", isUser, TestComplete);

//user usertest and quiz

router.get('/getRandomUsers', getRandomUser)

router.put("/userquiz/complete", isUser, userComplteteQuiz);
router.put("/usertest/compltete", isUser, userComplteteTest);

// follow and unfollow
router.put('/user/follow/:id', isUser, followOtherUser)

router.put('/user/block/:id', isUser, blockAndUnblockUser)

router.get('/getFollowingUsers', isUser, getAllFollwingUser)

router.get('/getFollowerUsers', isUser, getAllFollowerUser)

router.get('/getBlockedUsers', isUser, blockedUser)

module.exports = router;
