const express = require("express");
const router = express.Router();
const {
  getReports,
  updateReportStatus,
  reportPost,
} = require("../controller/reportController");

const { isUser, isAdmin } = require("../middleware/rolebaseuserValidate");

router.get("/report", isAdmin, getReports);
router.put("/report/:id", isAdmin, updateReportStatus);
router.post("/report", isUser, reportPost);

module.exports = router;
