const Poll = require("../model/pollModel");
const Post = require("../model/post");
const User = require("../model/user");
const createPoll = async (req, res) => {
  const userId = req.userId;
  try {
    const poll = new Poll({
      ...req.body,
      userId,
    });
    await poll.save();
    res.status(201).json({ success: true, data: poll });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const getPolls = async (req, res) => {
  try {
    const polls = await Poll.find();
    res.status(200).json(polls);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getPollById = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id).populate({
      path: 'comments.comment_user',
      select: 'name email image'
    });
    if (!poll)
      return res
        .status(404)
        .json({ success: false, message: "Poll not found" });
    res.status(200).json(poll);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updatePoll = async (req, res) => {
  const { id, optionId } = req.params;
  const userId = req.userId;
  try {
    const poll = await Poll.findOneAndUpdate(
      { _id: id, "options._id": optionId },
      { $addToSet: { "options.$.voters": userId } },
      { new: true }
    );
    if (!poll)
      return res
        .status(404)
        .json({ success: false, message: "Poll not found" });
    const totalVotes = poll.options.reduce(
      (sum, option) => sum + option.voters.length,
      0
    );
    poll.options.forEach((option) => {
      option.percent =
        totalVotes === 0 ? 0 : (option.voters.length / totalVotes) * 100;
    });

    await poll.save();
    res.status(200).json({ success: true, data: poll });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const deletePoll = async (req, res) => {
  try {
    const poll = await Poll.findByIdAndDelete(req.params.id);
    if (!poll)
      return res
        .status(404)
        .json({ success: false, message: "Poll not found" });
    res
      .status(200)
      .json({ success: true, message: "Poll deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/* const getMixedpollpost = async (req, res) => {
  try {
    const posts = await Post.find().populate({ path: 'comments.comment_user', select: 'name email image' }).populate({ path: 'user', select: 'name email image' }).lean();
    const polls = await Poll.find().populate({ path: 'options.voters', select: 'name email image' }).populate({ path: "userId", select: "name email image" }).populate({ path: 'comments.comment_user', select: 'name email image' }).lean();
    const content = [...posts, ...polls].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; */

const getMixedpollpost = async (req, res) => {
  // console.log("=================================== getMixedpoll post =============================================");

  try {
    const currentUserId = req.userId; // ID of the current user

    // console.log("currentUserId: ", currentUserId)

    // Fetch the current user to get the list of blocked users
    const currentUser = await User.findById(currentUserId).select("notVisibleUser").lean();
    if (!currentUser) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    const blockedUsers = currentUser.notVisibleUser; // Array of blocked user IDs

    // Fetch posts, excluding those created by blocked users
    const posts = await Post.find({
      user: { $nin: blockedUsers }, // Exclude posts from blocked users
    }).populate({ path: "comments.comment_user", select: "name email image" }).populate({ path: "images", }).populate({ path: "videos", }).populate({ path: "user", select: "name email image" }).lean();

    // Fetch polls, excluding those created by blocked users
    const polls = await Poll.find({
      userId: { $nin: blockedUsers }, // Exclude polls from blocked users
    }).populate({ path: "options.voters", select: "name email image" }).populate({ path: "images", }).populate({ path: "videos", }).populate({ path: "userId", select: "name email image" }).populate({ path: "comments.comment_user", select: "name email image" }).lean();

    // Combine posts and polls and sort by creation date
    const content = [...posts, ...polls].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    // console.log("content: ", content);

    res.status(200).json(content);
  } catch (error) {
    console.error("Error fetching mixed posts and polls:", error);
    res.status(500).json({ message: error.message });
  }
};


const polllikeunlike = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  try {

    const poll = await Poll.findById(id);
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    const isLiked = poll.like.includes(userId);

    if (isLiked) {
      poll.like.pull(userId);
    } else {
      poll.like.push(userId);
    }

    await poll.save();

    return res.status(200).json({
      message: isLiked ? "Unliked the poll" : "Liked the poll",
      poll,
    });
  } catch (error) {

    return res.status(500).json({ message: "Internal Server error" });
  }
}


const commentPoll = async (req, res) => {
  const { comment } = req.body;
  const { id } = req.params;
  const userId = req.userId;
  try {
    const response = await Poll.findByIdAndUpdate(
      id,
      {
        $push: {
          comments: {
            comment,
            comment_user: userId,
          },
        },
      },
      { new: true }
    );
    if (!response) {
      return res.status(404).json({ message: "Poll not found" });
    }
    return res
      .status(201)
      .json({ success: true, message: "Comment Added Successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server error" });
  }
};
module.exports = {
  createPoll,
  getPolls,
  getPollById,
  updatePoll,
  deletePoll,
  getMixedpollpost,
  polllikeunlike,
  commentPoll
};
