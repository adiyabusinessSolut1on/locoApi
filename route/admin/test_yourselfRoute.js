const express = require("express");
const router = express.Router();
const { isAdmin } = require("../../middleware/rolebaseuserValidate");
const {
  CreatTest,
  getAllTest,
  getSingleTest,
  UpdateTest,
  deleteTest,
  CreateTestQuestions,
  UpdateTstQuestion,
  deleteTestQuestion,
  getSingleTestQuestions,
} = require("../../controller/admin/testyourselfController");

//test your self
router.post("/test", isAdmin, CreatTest);
router.get("/test", isAdmin, getAllTest);
router.get("/test/:id", isAdmin, getSingleTest);
router.put("/test/:id", isAdmin, UpdateTest);
router.delete("/test/:id", isAdmin, deleteTest);

//test your self questions
router.post("/test/question/:testId", isAdmin, CreateTestQuestions);
router.get("/test/question/:id", isAdmin, getSingleTestQuestions);
router.put("/test/question/:id", isAdmin, UpdateTstQuestion);
router.delete("/test/question/:id", isAdmin, deleteTestQuestion);

module.exports = router;
