const bcrypt = require("bcrypt");
require("dotenv").config();
const User = require("../model/user");
const Post = require("../model/post");
const Mutual = require("../model/mutual");
const jwt = require("jsonwebtoken");
const TestYourSelf = require("../model/test_yourself/text_yourself");
const TestYourSelfQuestion = require("../model/test_yourself/testYourSelfQuestionModel");
const Quiz = require("../model/quiz/quizModel");
const QuizQuestion = require("../model/quiz/quizquestions");
const { sendNotifcationToAllUsers } = require("./notification");
const { sendMessage } = require("../services/notification");
const Notification = require("../model/Notification");
const Poll = require("../model/pollModel");
const Report = require("../model/report");

const UserRegister = async (req, res) => {
  const { image, name, email, mobile, password } = req.body;

  // console.log("req.body: ", req.body);
  try {
    const user = await User.findOne({ $or: [{ email: email }, { mobile: mobile }] });
    // console.log("user: ", user);

    if (user) {
      return res.status(409).json({ success: false, message: "User already exists! Please check mobile number of email id", });
    }

    // console.log("user: ", user);


    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ image: image, name: name, email: email, mobile: mobile, password: hashPassword, });

    await newUser.save();

    res.status(201).json({ success: true, message: "User created successfully", data: newUser, });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, });
  }
};


const UserLogin = async (req, res) => {
  const { email, password, fcmToken } = req.body;

  // console.log("req.body: ", req.body);


  try {
    const user = await User.findOne({ email: email });
    // console.log("user: ", user);

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid Email credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    // console.log("isMatch: ", isMatch);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid Password credentials" });
    }
    const token = jwt.sign({ _id: user._id, email: user?.email, role: user?.role }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRE_TIME, });
    // console.log("token: ", token);

    if (fcmToken) {
      user.fcmToken = fcmToken;
      await user.save();
    }

    return res.cookie("authorization", token, { httpOnly: true, expires: new Date(Date.now() + 240 * 60 * 60 * 1000), }).status(200).json({ success: true, message: "Login successful", token: token });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, });
  }
};
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password, -savePosts, -likedPosts").select("-otp").select("-password");
    if (!user) {
      return res.status(403).json({ success: false, message: "user Not Found" });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, });
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Post.findByIdAndDelete(id);
    if (!response) {
      return res.status(404).json({ success: false, message: "Data Not Found" });
    }
    res.status(200).json({ success: true, message: " post Delete", });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, });
  }
};
const UpdatePost = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Post.findByIdAndUpdate(id, req.body, { new: true, });
    if (!response) {
      return res.status(404).json({ success: false, message: "Data Not Found" });
    }
    res.status(200).json({ success: true, message: "Post Updated", data: response, });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const userPost = async (req, res) => {
  const { thumnail, content, mediatype } = req.body;

  try {
    const newPost = new Post({ thumnail: thumnail, mediatype: mediatype, content: content, user: req.userId, });

    await newPost.save();

    await sendNotifcationToAllUsers("One New Post Created Recently", content, "post", req.userId, thumnail)
    res.status(201).json({ success: true, message: "post created successfully", data: newPost, });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, });
  }
};
const getAllPost = async (req, res) => {
  try {
    const response = await Post.find().populate({ path: "user", select: "-password -otp", }).populate({ path: "comments.comment_user", select: "-password -otp", });

    if (!response.length > 0) {
      return res.status(404).json({ success: false, message: "Data Not Found" });
    }
    res.status(200).json({ success: true, message: "get post Successfully", data: response, });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, });
  }
};

const getAllPostByUserId = async (req, res) => {
  const userId = req.userId;
  try {
    const response = await Post.find({ user: userId }).populate({ path: "user", select: "-password -otp", }).populate({ path: "comments.comment_user", select: "-password -otp", });
    if (!response.length > 0) {
      return res.status(404).json({ success: false, message: "Data Not Found" });
    }
    res.status(200).json({ success: true, message: "get post Successfully", data: response, });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, });
  }
};
const getSinglePost = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Post.findById(id)
      .populate({
        path: "user",
        select: "_id name image email",
      })
      .populate({
        path: "comments.comment_user",
        select: "_id name image email",
      });
    if (!response) {
      return res
        .status(404)
        .json({ success: false, message: "Data Not Found" });
    }
    res.status(200).json({
      success: true,
      message: "get post Successfully",
      data: response,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const DeleteMutualPost = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Mutual.findByIdAndDelete(id);
    if (!response) {
      return res
        .status(404)
        .json({ success: false, message: "Data Not Found" });
    }
    res.status(200).json({
      success: true,
      message: " Mutual post Delete",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const UpdateMutualPost = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Mutual.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!response) {
      return res
        .status(404)
        .json({ success: false, message: "Data Not Found" });
    }
    res.status(200).json({
      success: true,
      message: "get post Updated",
      data: response,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const userMutualPost = async (req, res) => {
  const { name, email, mobile, currentdivision, designation, currentlobby, wantedlobby, wanteddivision, } = req.body;
  try {

    const newMutual = new Mutual({ userId: req.userId, name: name, email: email, mobile: mobile, currentdivision: currentdivision, designation: designation, currentlobby: currentlobby, wantedlobby: wantedlobby, wanteddivision: wanteddivision, });
    await newMutual.save();
    res.status(201).json({ success: true, message: "post created successfully", data: newMutual, });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, });
  }
};

const getAllFormPost = async (req, res) => {
  try {
    // const response = await Mutual.find().populate('userId');
    const response = await Mutual.find().populate('userId', '-password -quiz -savePosts -test_yourself -fcmToken -isVerify -likedPosts -daily_task'); // Exclude specific fields

    if (!response.length > 0) {
      return res.status(404).json({ success: false, message: "Data Not Found" });
    }
    res.status(200).json({ success: true, message: "get post Successfully", data: response, });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, });
  }
};

const LikePosts = async (req, res) => {
  const userId = req.userId;
  try {
    const { id } = req.params;

    const updatedUser = await User.findByIdAndUpdate(userId, { $push: { likedPosts: id } }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const post = await Post.findByIdAndUpdate(id, { $inc: { like: 1 } }, { new: true });

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const checkUser = await User.findById(post?.user)

    if (checkUser) {
      await sendMessage(post?.user, post?.thumnail, post?.content, "post like", checkUser?.fcmToken, req?.userId)
    }

    res.status(200).json({ success: true, message: "Post liked successfully", data: post, });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, });
  }
};

const userLikedPosts = async (req, res) => {
  const userId = req.userId;
  try {
    const response = await User.findById(userId).populate("likedPosts");
    if (!response) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      data: response?.likedPosts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const SavePosts = async (req, res) => {
  const userId = req.userId;
  try {
    const response = await User.findById(userId).populate("savePosts");
    if (!response) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      data: response?.savePosts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const unLikePosts = async (req, res) => {
  const userId = req.userId;
  try {
    const { id } = req.params;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { likedPosts: id } },
      { new: true }
    );
    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const post = await Post.findByIdAndUpdate(
      id,
      { $inc: { like: -1 } },
      { new: true }
    );

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    res.status(200).json({
      success: true,
      message: "Post Un-liked successfully",
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const CommentPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const userId = req.userId;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const newComment = { comment: comment, comment_user: userId };
    post.comments.push(newComment);
    await post.save();

    const checkUser = await User.findById(post?.user)

    if (checkUser) {
      await sendMessage(post?.user, post?.thumnail, post?.content, "post comment", checkUser?.fcmToken, req?.userId)
    }

    res.status(200).json({ success: true, message: "Comment added successfully", data: post, });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, });
  }
};
const getAllFormPostByUserId = async (req, res) => {
  const userId = req.userId;
  try {
    const response = await Mutual.find({ userId: userId }).populate('userId');

    if (!response.length > 0) {
      return res.status(404).json({ success: false, message: "Data Not Found" });
    }
    res.status(200).json({ success: true, message: "get post Successfully", data: response, });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, });
  }
};

const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const getSeachMutualpostUsingDvision = async (req, res) => {
  const { search } = req.query;
  try {
    if (!search || search.trim() === "") {
      return res.send({ success: false, message: "Search query cannot be empty", });
    }
    const escapedSearch = escapeRegex(search);
    const searchRegex = new RegExp(`^${escapedSearch}`, "i");
    const response = await Mutual.find({ $or: [{ currentdivision: searchRegex }], }).populate('userId');

    if (!response.length > 0) {
      return res.status(404).json({ success: false, message: "Data Not Found" });
    }
    res.status(200).json({ success: true, message: "get post Successfully", data: response, });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, });
  }
};

const getSeachMutualpostUsingwantedLobby = async (req, res) => {
  const { search } = req.query;
  try {
    if (!search || search.trim() === "") {
      return res.send({ success: false, message: "Search query cannot be empty", });
    }
    const escapedSearch = escapeRegex(search);
    const searchRegex = new RegExp(`^${escapedSearch}`, "i");
    const response = await Mutual.find({ $or: [{ currentlobby: searchRegex }], }).populate('userId');

    if (!response.length > 0) {
      return res.status(404).json({ success: false, message: "Data Not Found" });
    }
    res.status(200).json({ success: true, message: "get post Successfully", data: response, });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, });
  }
};
const UpdateUserProfile = async (req, res) => {
  const id = req.userId;
  const data = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, { $set: data }, { new: true }).select("-password");

    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(202).send({ success: true, message: "user Updated", data: updatedUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, });
  }
};
const savePostInUser = async (req, res) => {
  const id = req.userId;

  try {
    const { postId } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $push: { savePosts: postId } },
      { new: true }
    ).populate("savePosts");

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Saved post updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const removePostFromUser = async (req, res) => {
  const id = req.userId;
  try {
    const { postId } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $pull: { savePosts: postId } },
      { new: true }
    ).populate("savePosts");

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Post removed successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getAllQuiz = async (req, res) => {
  try {
    const response = await Quiz.find().populate("questions");
    if (!response?.length > 0) {
      return res
        .status(200)
        .json({ success: false, mesaage: "Quiz Not Found" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getSingleQuiz = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Quiz.findById(id).populate("questions");
    if (!response) {
      return res
        .status(200)
        .json({ success: false, mesaage: "Quiz Not Found" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAllTest = async (req, res) => {
  try {
    const response = await TestYourSelf.find().populate("questions");
    if (!response?.length > 0) {
      return res
        .status(200)
        .json({ success: false, mesaage: "Test Not Found" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getSingleTest = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await TestYourSelf.findById(id).populate("questions");
    if (!response) {
      return res
        .status(200)
        .json({ success: false, mesaage: "Test Not Found" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const UpdateAnswer = async (req, res) => {
  const { id } = req.params;
  const { answer } = req.body;
  try {
    const question = await QuizQuestion.findById(id);

    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    question.actualresult = answer;
    question.isTrue = answer === question.predicted_result;

    await question.save();

    res.status(200).json({
      success: true,
      data: question,
      message: "Answer submitted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const QuizComplete = async (req, res) => {
  const { id } = req.params;
  try {
    const quiz = await Quiz.findById(id).populate("questions");
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }
    const answeredQuestions = quiz?.questions.filter((q) => q.isTrue !== undefined);
    const rightAnswers = answeredQuestions.filter((q) => q.isTrue).length;
    const wrongAnswers = answeredQuestions.length - rightAnswers;
    const score = (rightAnswers / quiz.questions.length) * 100;
    const updatedQuiz = await Quiz.findByIdAndUpdate(id, { rightanswers: rightAnswers, wronganswers: wrongAnswers, score: score, isComplete: true, }, { new: true });

    res.status(200).json({ success: true, message: "Quiz results updated successfully", data: updatedQuiz, });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, });
  }
};


const UpdateTestAnswer = async (req, res) => {
  const { id } = req.params;
  const { answer } = req.body;
  try {
    const question = await TestYourSelfQuestion.findById(id);

    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    question.actualresult = answer;
    question.isTrue = answer === question.predicted_result;

    await question.save();

    res.status(200).json({
      success: true,
      data: question,
      message: "Answer submitted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const TestComplete = async (req, res) => {
  const { id } = req.params;
  try {
    const quiz = await TestYourSelf.findById(id).populate("questions");
    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Test not found" });
    }
    const answeredQuestions = quiz?.questions.filter(
      (q) => q.isTrue !== undefined
    );
    const rightAnswers = answeredQuestions.filter((q) => q.isTrue).length;
    const wrongAnswers = answeredQuestions.length - rightAnswers;
    const score = (rightAnswers / quiz.questions.length) * 100;
    const resp = await TestYourSelf.findByIdAndUpdate(
      id,
      {
        rightanswers: rightAnswers,
        wronganswers: wrongAnswers,
        score: score,
        isComplete: true,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Test results updated successfully",
      data: resp,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const userComplteteQuiz = async (req, res) => {
  const id = req.userId;
  try {
    const response = await User.findById(id);
    if (!response) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }
    response.quiz.push(req.body);

    await response.save();
    res.status(200).json({
      success: true,
      message: "Quiz data added to user successfully",
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const userComplteteTest = async (req, res) => {
  const id = req.userId;
  try {
    const response = await User.findById(id);
    if (!response) {
      return res
        .status(403)
        .json({ success: false, message: "user not found" });
    }
    response.test_yourself.push(req.body);

    await response.save();
    res.status(200).json({
      success: true,
      message: "Test data added to user successfully",
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// my chnages
const deleteUserAccount = async (req, res) => {
  const id = req.params.id
  // console.log("id: ", id);

  try {
    const checkUser = await User.findById(id)
    if (!checkUser) {
      return res.status(404).json({ success: false, message: "User not found", });
    }

    const checkMutual = await Mutual.deleteMany({ userId: id })
    // console.log("checkMutual", checkMutual);

    const checkNotification = await Notification.deleteMany({ $or: [{ senderId: id }, { recipient: id }], });
    // console.log("checkNotification", checkNotification);

    const deletedPolls = await Poll.deleteMany({ userId: id });
    // console.log("deletedPolls", deletedPolls);

    // Step 2: Remove the user from the `voters` array in all polls
    // const updatedPolls = await Poll.updateMany(
    //   { "options.voters": id },
    //   { $pull: { "options.$[].voters": id } } // Remove userId from voters in all options
    // );
    // console.log("updatedPolls", updatedPolls);

    const checkPost = await Post.deleteMany({ user: id })
    // console.log("checkPost", checkPost);
    const checkReport = await Report.deleteMany({ $or: [{ reportedBy: id }, { reportedUser: id }] })
    // console.log("checkReport", checkReport);


    const result = await User.findByIdAndDelete(id)
    if (result) {
      return res.status(200).json({ success: true, message: `User ${result?.name} deleted successfully.`, data: result, })
    }
    return res.status(400).json({ success: false, message: "Failed to delte user", });

  } catch (error) {
    console.log("error on deleting user: ", error);

    res.status(500).json({ success: false, message: error.message, });
  }
}

module.exports = {
  getUser,
  UserRegister,
  UserLogin,
  userPost,
  getAllPost,
  getAllPostByUserId,
  userMutualPost,
  getAllFormPost,
  getAllFormPostByUserId,
  getSeachMutualpostUsingDvision,
  getSeachMutualpostUsingwantedLobby,
  UpdateUserProfile,
  LikePosts,
  CommentPost,
  savePostInUser,
  getAllQuiz,
  getSingleQuiz,
  getAllTest,
  getSingleTest,
  UpdateAnswer,
  QuizComplete,
  UpdateTestAnswer,
  TestComplete,
  userComplteteQuiz,
  userComplteteTest,
  removePostFromUser,
  UpdateMutualPost,
  DeleteMutualPost,
  UpdatePost,
  deletePost,
  unLikePosts,
  SavePosts,
  userLikedPosts,
  getSinglePost,
  deleteUserAccount
};
