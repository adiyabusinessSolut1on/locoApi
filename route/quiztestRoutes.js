const express = require("express");
const router = express.Router();
const { isAdmin, isUser } = require("../middleware/rolebaseuserValidate");
const { userComplteteQuiz, getAllQuizTestCategory, userComplteteTest, userComplteteDailyTask, getAllTest, getAllQuiz, getAllDailyTask, getSingleDailyTask, dailyTasksCompleted, getSingleDailyTaskSTatus } = require("../controller/quiztestController");

router.get("/quiz", getAllQuiz);
router.get("/test", getAllTest);
router.get("/daily-task", getAllDailyTask);
router.get("/daily-task/:id", getSingleDailyTask);
router.get("/daily-task/get-status/:id", isUser, getSingleDailyTaskSTatus);
router.put("/daily-task/update/:id", isUser, dailyTasksCompleted); //task to marke as compnented api
router.put("/userquiz/complete", isUser, userComplteteQuiz);
router.put("/usertest/complete", isUser, userComplteteTest);
router.put("/usertask/complete", isUser, userComplteteDailyTask);
// user can get 
router.get("/quiz/category", getAllQuizTestCategory);
module.exports = router;
