const express = require('express');
const router = express.Router();
const { isAdmin } = require('../../middleware/rolebaseuserValidate');
const { dailyTaskCreate, dailyTaskgetAll, dailyTaskgetSingle, UpdatedailyTask, DeletedailyTask } = require("../../controller/admin/dailytaskController.js")

router.post("/daily-task", isAdmin, dailyTaskCreate);
router.get("/daily-task", isAdmin, dailyTaskgetAll);
router.get("/daily-task/:id", isAdmin, dailyTaskgetSingle);
router.put("/daily-task/:id", isAdmin, UpdatedailyTask);
router.delete("/daily-task/:id", isAdmin, DeletedailyTask);

module.exports = router;