const User = require("../model/user");
const Report = require("../model/report");
const sendReportMail = require("../email-templates/reportEmail");
const { sendMessage } = require("../services/notification");
const Post = require("../model/post");

const reportPost = async (req, res) => {
  try {
    // console.log("================================= report post ====================================")
    const { reportedUser, reportedPost, reason, description, awareness, blog, community } = req.body;
    // console.log("req.body: ", req.body);

    /*  console.log({
       reportedBy: req.userId,
       reportedUser,
       reportedPost: reportedPost,
       awareness: awareness,
       blog: blog,
       reason,
       description,
     }); */


    // console.log(req.userId);
    const newReport = new Report({
      reportedBy: req.userId,// Assuming admin info is stored in req.user
      reportedUser,
      reportedPost: reportedPost,
      awareness: awareness,
      blog: blog,
      reason,
      description,
      community,
    });

    await newReport.save();

    if (reportedUser) {
      const user = await User.findById(reportedUser);

      const userEmail = user.email;
      const subject = "Your Post Has Been Reported";
      const message = `Your post has been reported for ${reason}. Please review our guidelines and avoid posting inappropriate content.`;

      sendReportMail(userEmail, subject, message);

      const checkPost = await Post.findById(reportedPost);

      if (user?.fcmToken) {
        await sendMessage(reportedUser, subject, message, "report", user?.fcmToken, req?.userId, checkPost?.thumnail)
      }
    }

    return res.status(201).json({ message: "Report submitted successfully", data: "newReport" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error reporting post", error: error.message });
  }
};

const getReports = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const reports = await Report.find(filter)
      .populate("reportedBy")
      .populate("reportedUser")
      .populate("reportedPost")
      .populate("awareness")
      .populate("blog")

    return res.status(200).json(reports);
  } catch (error) {
    console.log("get all", error);
    return res
      .status(500)
      .json({ message: "Error fetching reports", error: error.message });
  }
};

const updateReportStatus = async (req, res) => {
  try {
    const reportId = req.params.id;
    const { status } = req.body;

    if (!["Pending", "Reviewed", "Resolved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const report = await Report.findByIdAndUpdate(
      reportId,
      { status },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    const user = await User.findById(report.reportedUser);

    console.log(user);

    let subject = "";
    let message = "";

    if (status === "Reviewed") {
      subject = "Your Post is Under Review";
      message =
        "Your post is currently being reviewed due to reports. You may receive further updates if action is required.";
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

/* const hidePostUser = async (req, res) => {
  const id = req.params.id; //this id will be the user whose post should be hidden

  try {

    const checkUser = await User.findById(id)
    if(!checkUser){
      return res.status(400).json({message: "User not found", success: false})
    }

    const checkReporterUser = await User.findById(req.userId)
    if(!checkReporterUser){
      return res.status(403).json({message: "Unathorized access!", success: false})
    }

  } catch (error) {
    return res.status(500).json({ message: "Error updating report status", error });
  }
} */

const blockUserPosts = async (req, res) => {
  const userId = req.userId; // ID of the current user
  const blockUserId = req.params.id; // ID of the user to block

  console.log("======================================= blockUserPost ================================ ")
  // console.log("req.params: ", req.params)
  // console.log("req.userId: ", req.userId)
  try {
    // Ensure the user to block exists
    const blockUserExists = await User.findById(blockUserId);
    if (!blockUserExists) {
      return res.status(404).json({ message: "User to block not found", success: false });
    }

    // Find the current user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(403).json({ message: "Unauthorized access!", success: false });
    }

    // Check if the user is already blocked
    const alreadyBlocked = user.notVisibleUser.includes(blockUserId);
    if (alreadyBlocked) {
      return res.status(200).json({ message: "User already blocked", success: true });
    }

    // Add the user to the blocked list
    user.notVisibleUser.push(blockUserId);
    await user.save();

    return res.status(200).json({ message: "User successfully blocked", success: true });
  } catch (error) {
    console.error("Error blocking user:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};



module.exports = { reportPost, getReports, updateReportStatus, blockUserPosts };
