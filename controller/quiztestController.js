const User = require("../model/user");
const TestYourSelf = require("../model/test_yourself/text_yourself");
const TestYourSelfQuestion = require("../model/test_yourself/testYourSelfQuestionModel");
const Quiz = require("../model/quiz/quizModel")
const DailyTask = require("../model/daily-taskModel")
const QuizQuestion = require("../model/quiz/quizquestions");
const moment = require("moment");

const userComplteteQuiz = async (req, res) => {
  const id = req.userId
  try {
    const response = await User.findById(id);
    if (!response) {
      return res.status(404).json({ success: false, message: 'user not found' });
    }
    response.quiz.push(req.body);

    await response.save();
    res.status(200).json({ success: true, message: 'Quiz data added to user successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, });
  }
};

const userComplteteTest = async (req, res) => {
  const id = req.userId
  try {
    const response = await User.findById(id);
    if (!response) {
      return res.status(403).json({ success: false, message: 'user not found' });
    }
    response.test_yourself.push(req.body);

    await response.save();
    res.status(200).json({ success: true, message: 'Test data added to user successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, });
  }

};

const userComplteteDailyTask = async (req, res) => {
  const id = req.userId
  try {
    const response = await User.findById(id);
    if (!response) {
      return res.status(403).json({ success: false, message: 'user not found' });
    }
    response.daily_task.push(req.body);

    await response.save();
    res.status(200).json({ success: true, message: 'Test data added to user successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, });
  }
};

const getAllTest = async (req, res) => {
  try {
    const response = await TestYourSelf.find().populate("questions");
    if (!response?.length > 0) {
      return res.status(200).json({ success: false, mesaage: "Test Not Found" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllQuiz = async (req, res) => {
  try {
    const response = await Quiz.find().populate("questions");
    if (!response?.length > 0) {
      return res.status(200).json({ success: false, mesaage: "Quiz Not Found" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllDailyTask = async (req, res) => {
  const currentDate = req.query?.currentDate;
  const parsedDate = new Date(currentDate);

  if (isNaN(parsedDate)) {
    return res.status(400).json({ success: false, message: "Invalid date format" });
  }

  // Get the start and end of the day
  const startOfDay = new Date(parsedDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(parsedDate);
  endOfDay.setHours(23, 59, 59, 999);


  try {
    const response = await DailyTask.find({ createdAt: { $gte: startOfDay, $lte: endOfDay } }).populate("video").populate("quiz").populate("test").populate("blog").populate("awareness");
    if (!response?.length > 0) {
      return res.status(404).json({ success: false, message: "No Daily Task Found" });
    }
    res.status(200).json(response);
  } catch (err) {
    res.status(500).send({ success: false, message: "Inter Server Error", error: err });
  }
};

const getSingleDailyTask = async (req, res) => {
  const { id } = req.params
  try {
    const result = await DailyTask.findById(id).populate("video").populate("quiz").populate("test").populate("blog").populate("awareness");
    if (!result) {
      return res.status(404).json({ success: false, message: "Daily Task not found" });
    }
    return res.status(200).json({ message: "Task successfully", success: true, result })
  } catch (error) {
    return res.status(500).send({ success: false, message: "Inter Server Error", error });
  }
}

module.exports = {
  userComplteteQuiz, userComplteteTest, userComplteteDailyTask,
  getAllTest,
  getAllQuiz,
  getAllDailyTask,
  getSingleDailyTask
}