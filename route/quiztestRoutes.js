const express = require("express");
const router = express.Router();
const { isAdmin,isUser } = require("../middleware/rolebaseuserValidate");
const {userComplteteQuiz,getAllQuizTestCategory,userComplteteTest,userComplteteDailyTask,getAllTest,getAllQuiz,getAllDailyTask}=require("../controller/quiztestController");

router.get("/quiz",getAllQuiz);
router.get("/test", getAllTest);
router.get("/daily-task",getAllDailyTask);
router.put("/userquiz/complete",isUser,userComplteteQuiz);
router.put("/usertest/complete",isUser,userComplteteTest);
router.put("/usertask/complete",isUser,userComplteteDailyTask);
// user can get 
router.get("/quiz/category",getAllQuizTestCategory);
module.exports = router;
