const Poll = require("../model/pollModel");
const Post=require("../model/post")
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
        const totalVotes = poll.options.reduce((sum, option) => sum + option.voters.length, 0);
    poll.options.forEach(option => {
      option.percent = totalVotes === 0 ? 0 : (option.voters.length / totalVotes) * 100;
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
const getMixedpollpost = async (req, res) => {
  try {
    const posts = await Post.find().populate({
      path: 'comments.comment_user',
      select: 'name email image'
    }).populate({
      path: 'user',
      select: 'name email image'
    });
    const polls = await Poll.find() .populate({
      path: 'options.voters',
      select: 'name email image'
    });
    const content = [...posts, ...polls].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createPoll,
  getPolls,
  getPollById,
  updatePoll,
  deletePoll,
  getMixedpollpost
};
