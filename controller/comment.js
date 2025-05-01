const Comment = require("../model/Comment")
const Community = require("../model/Community")
const User = require("../model/user");
const { sendMessage } = require("../services/notification");
const { sendNotifcationToAllUsers } = require("./notification");

exports.getCommentsByCommunityId = async (req, res) => {
    const id = req.params.id;
    try {
        // Check if the community exists
        const checkCommunity = await Community.findById(id);
        if (!checkCommunity) {
            return res.status(404).json({ success: false, message: "Community not found" });
        }

        // Fetch comments with populated replies and sorted by creation date
        const result = await Comment.find({ communityId: id, commentType: 'comment' })
            .sort({ createdAt: -1 }) // Sort comments by latest
            .populate({
                path: "replies", // Populate replies
                options: { sort: { createdAt: -1 } }, // Sort replies by latest
                populate: { path: "userId", select: "name image email" }, // Populate user details in replies
                populate: [
                    { path: "userId", select: "name image email mobile" },
                    {
                        path: "replies", // Populate child replies recursively
                        populate: { path: "userId", select: "name image email mobile" }
                    }
                ],
                options: { sort: { createdAt: -1 } }, // Sort comments by creation date}]
            }).populate({
                path: "userId", // Populate user who made the comment
                select: "name image email",
            }).populate({
                path: "communityUserId", // Populate the community user who made the comment
                select: "name image email",
            });

        return res.status(200).json({ success: true, message: "Comments fetched successfully", data: result });
    } catch (error) {
        console.error("Error in getCommentsByCommunityId: ", error);
        return res.status(500).json({ message: error.message, error: error, success: false });
    }
};

/* exports.getAllCommentsCommunity = async (req, res) => {
    const id = req.params?.id
    try {
        const checkCommunity = await Community.findById(id)
        if (!checkCommunity) {
            return res.status(404).json({ success: false, message: "Community not found" });
        }
        const result = await Comment.find({ communityId: id, commentType: 'comment' })
    } catch (error) {
        console.error("Error in getAllCommentsCommunity: ", error);
        return res.status(500).json({ message: error.message, error: error, success: false });
    }
} */


//add comment
exports.addComment = async (req, res) => {
    const communityId = req.params?.id
    const comment = req.body?.comment
    const userId = req.userId
    try {
        const checkUser = await User.findById(userId)
        if (!checkUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const checkCommunity = await Community.findById(communityId)
        if (!checkCommunity) {
            return res.status(404).json({ success: false, message: "Community not found" });
        }
        const communityUser = await User.findById(checkCommunity.userId)
        if (!comment) {
            return res.status(400).json({ success: false, message: "Comment is required" });
        }
        const newComment = await Comment.create({ comment: comment, userId, communityId, communityUserId: checkCommunity.userId });
        checkCommunity.comments.push(newComment?._id)
        checkUser.comments.push(newComment?._id)
        await checkUser.save()
        const result = await checkCommunity.save()

        await sendMessage(communityUser._id, `${checkUser?.name} commented on your post. See what they said!`, null, "community-comment", communityUser?.fcmToken, userId, null, null)
        if (result) {
            return res.status(201).json({ message: "Comment added successfully", success: true, data: newComment });
        }
        return res.status(400).json({ message: "Failed to add comment", success: false });

    } catch (error) {
        console.log("error on addComment: ", error);
        return res.status(500).json({ message: error.message, error: error, success: false });
    }
}

// comment likes and unlikes
exports.likesAndUnlikesComment = async (req, res) => {
    const commentId = req.params?.id
    const userId = req.userId
    try {
        const checkUser = await User.findById(userId)
        if (!checkUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const checkComment = await Comment.findById(commentId)
        if (!checkComment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }
        const checkCommentUser = await User.findById(checkComment.userId)
        let liked = checkComment.likes.includes(userId)
        if (checkComment.likes.includes(userId)) {
            checkComment.likes = checkComment.likes.filter((id) => id != userId)
        } else {
            checkComment.likes.push(userId)
        }
        await checkComment.save()

        await sendMessage(checkCommentUser._id, `Your post just got a ${liked ? "unliked" : "liked"} from ${checkUser?.name}. ${liked ? "check it out." : "Keep sharing great content"}!`, null, "community-comment", checkCommentUser?.fcmToken, userId, null, null)
        // await sendMessage(checkCommentUser._id, `${checkCommentUser?.name} you just got ${liked ? "unliked" : "like"}! just check it out.`, null, "community-comment", checkCommentUser?.fcmToken, userId, null, null)
        return res.status(200).json({ message: "Comment liked/unliked successfully", success: true, data: checkComment });
    } catch (error) {
        console.log("error on likesAndUnlikesComment: ", error);
        return res.status(500).json({ message: error.message, error: error, success: false });
    }
}


// replay
exports.addReplyToComment = async (req, res) => {
    // console.log("========================== addReplyToComment =========================");

    // console.log("req.param: ", req.params);
    // console.log("req.body: ", req.body);

    const { commentId } = req.params; // ID of the comment to reply to
    const { comment } = req.body; // Reply content
    const userId = req.userId; // User ID of the replier

    try {
        // Validate input
        if (!comment) {
            return res.status(400).json({ success: false, message: "Reply content is required" });
        }

        const checkUser = await User.findById(userId);

        // Find the parent comment
        const parentComment = await Comment.findById(commentId);
        if (!parentComment) {
            return res.status(404).json({ success: false, message: "Parent comment not found" });
        }
        const parnetCommentUser = await User.findById(parentComment.userId)//user who has commented 

        // Create the reply comment
        const replyComment = new Comment({ userId, communityUserId: parentComment.communityUserId, communityId: parentComment.communityId, comment, commentType: 'reply' });

        // Save the reply comment
        const savedReply = await replyComment.save();

        // Add the reply to the parent comment
        parentComment.replies.push(savedReply._id);
        checkUser.comments.push(replyComment?._id)

        await parentComment.save();
        await checkUser.save();

        await sendMessage(parnetCommentUser._id, `${checkUser?.name} replied to your comment. See what they said!`, null, "community-reply", parnetCommentUser?.fcmToken, userId, null, null)
        return res.status(201).json({ success: true, message: "Reply added successfully", data: savedReply, });
    } catch (error) {
        console.error("Error in addReplyToComment:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};


// delete comment
exports.deleteComment = async (req, res) => {
    const id = req.params.id;
    const userId = req.userId;
    try {
        if (!id) {
            return res.status(400).json({ success: false, message: "Comment ID is required" });
        }
        const checkUser = User.findById(userId)
        if (!checkUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }
        if (comment.userId.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "You are not authorized to delete this comment" });
        }

        await User.aggregate([
            { $match: { _id: mongoose.Types.ObjectId(userId) } },
            {
                $set: {
                    comments: { $filter: { input: "$comments", as: "comment", cond: { $ne: ["$$comment", mongoose.Types.ObjectId(id)] } } }
                }
            }
        ]);

        await Comment.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error in deleteComment:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}