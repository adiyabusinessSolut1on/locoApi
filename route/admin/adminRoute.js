const express = require('express');
const router = express.Router();
const { isAdmin } = require('../../middleware/rolebaseuserValidate');
const { UserRegisterdByAdmin, getAllMutualPost, getAllPosts, UserRegister, UserLogin, getUser, getAllUsers, getUserById, UpdateUser, UserLoginOTP_Verify, deleteUser, ForGetPassword, VeriFyOTP } = require("../../controller/admin/adminController");
const { NotificationPush } = require("../../controller/admin/NotificationController")
//admin
router.post('/register', UserRegister);
router.post("/login", UserLogin);
router.post("/loginotp/verify", UserLoginOTP_Verify)
router.get("/get_myself", isAdmin, getUser);
router.post("/forget-password", ForGetPassword);
router.post("/verifyotp", VeriFyOTP);



//users data route for admin access
router.get("/all-user", isAdmin, getAllUsers);
router.get("/getuser/:id", isAdmin, getUserById);
router.put("/update-user/:id", isAdmin, UpdateUser);
router.delete("/userDelete/:id", isAdmin, deleteUser);

//Admin Can Create Users
router.post("/create-user", isAdmin, UserRegisterdByAdmin);


//Get All Mutual Post
router.get("/mutual/post", getAllMutualPost)

// Get All User Posts
router.get("/posts", getAllPosts);
router.post("/notify", isAdmin, NotificationPush);



module.exports = router;