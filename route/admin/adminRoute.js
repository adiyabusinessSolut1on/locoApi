const express = require("express");
const router = express.Router();
const { isAdmin } = require("../../middleware/rolebaseuserValidate");
const { UserRegister, UserLogin, getUser, getAllUsers, getUserById, UpdateUser, deleteUser, ForGetPassword, VeriFyOTP, UserLoginOTP_Verify, } = require("../../controller/admin/adminController");

//admin
router.post("/register", UserRegister);
router.post("/login", UserLogin);
router.get("/get_myself", isAdmin, getUser);
router.post("/forget-password", ForGetPassword);
router.post("/verifyotp", VeriFyOTP);
router.post("/loginotp/verify", UserLoginOTP_Verify);

//users data route for admin access
router.get("/all-user", isAdmin, getAllUsers);
router.get("/getuser/:id", isAdmin, getUserById);
router.put("/update-user/:id", isAdmin, UpdateUser);
router.delete("/userDelete/:id", isAdmin, deleteUser);

module.exports = router;
