const express = require("express");
const router = express.Router();
const {
  getReports,
  updateReportStatus,
  reportPost,
} = require("../controller/reportController");

const { isUser, isAdmin } = require("../middleware/rolebaseuserValidate");

router.get("/", isAdmin, getReports);
router.put("/:id", isAdmin, updateReportStatus);
router.post("/", isUser, reportPost);

module.exports = router;
