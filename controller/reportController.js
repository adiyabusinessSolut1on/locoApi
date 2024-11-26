const User = require("../model/user");
const Report = require("../model/report");
const sendReportMail = require("../email-templates/reportEmail");
const { sendMessage } = require("../services/notification");
const Post = require("../model/post");

const reportPost = async (req, res) => {
  try {
    const { reportedUser, reportedPost, reason, description } = req.body;

    const newReport = new Report({
      reportedBy: req.userId, // Assuming admin info is stored in req.user
      reportedUser,
      reportedPost,
      reason,
      description,
    });

    await newReport.save();

    // console.log("reportedUser: ", reportedUser);

    const user = await User.findById(reportedUser);

    const checkPost = await Post.findById(reportedPost);

    // console.log(user);

    const userEmail = user.email;
    const subject = "Your Post Has Been Reported";
    const message = `Your post has been reported for ${reason}. Please review our guidelines and avoid posting inappropriate content.`;

    sendReportMail(userEmail, subject, message);


    await sendMessage(reportedUser, checkPost?.content, checkPost?.content, "report", user?.fcmToken, req?.userId, checkPost?.thumnail)

    return res.status(201).json({ message: "Report submitted successfully", data: newReport });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error reporting post", error: error.message });
  }
};

const getReports = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const reports = await Report.find(filter).populate("reportedBy").populate("reportedUser").populate("reportedPost");

    return res.status(200).json(reports);
  } catch (error) {
    console.log("get all", error);
    return res.status(500).json({ message: "Error fetching reports", error: error.message });
  }
};

const updateReportStatus = async (req, res) => {
  try {
    const reportId = req.params.id;
    const { status } = req.body;

    if (!["Pending", "Reviewed", "Resolved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const report = await Report.findByIdAndUpdate(reportId, { status }, { new: true });

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    const user = await User.findById(report.reportedUser);

    console.log(user);

    let subject = "";
    let message = "";

    if (status === "Reviewed") {
      subject = "Your Post is Under Review";
      message = "Your post is currently being reviewed due to reports. You may receive further updates if action is required.";
    } else if (status === "Resolved") {
      subject = "Your Post has been Resolved";
      message =
        "After reviewing your post, we found it to violate our guidelines and it has been removed. Please adhere to the guidelines going forward.";
    }

    const userEmail = user.email;
    sendReportMail(userEmail, subject, message);

    return res.status(200).json({ success: true, message: "Report status updated", report });
  } catch (error) {
    return res.status(500).json({ message: "Error updating report status", error });
  }
};

module.exports = { reportPost, getReports, updateReportStatus };
