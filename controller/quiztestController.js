const User = require("../model/user");
const TestYourSelf=require("../model/test_yourself/text_yourself");
const TestYourSelfQuestion=require("../model/test_yourself/testYourSelfQuestionModel");
const Quiz=require("../model/quiz/quizModel")
const DailyTask=require("../model/daily-taskModel")
const QuizQuestion=require("../model/quiz/quizquestions");
const QuizTestCategory=require("../model/quiz/quiz_testCategoryModel")
const userComplteteQuiz = async (req, res) => {
    const id=req.userId
    try {
      const response = await User.findById(id);
      if (!response) {
        return res.status(404).json({ success: false, message: 'user not found' });
      }
      response.quiz.push(req.body);
     
      await response.save();
      res.status(200).json({
        success: true,
        message: 'Quiz data added to user successfully',
        data: response
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
   
  };

  const userComplteteTest = async (req, res) => {
    const id=req.userId
    try {
      const response = await User.findById(id);
      if (!response) {
        return res.status(403).json({ success: false, message: 'user not found' });
      }
      response.test_yourself.push(req.body);
      await response.save();
      res.status(200).json({
        success: true,
        message: 'Test data added to user successfully',
        data: response
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
   
  };
  const userComplteteDailyTask = async (req, res) => {
    const id=req.userId
    try {
      const response = await User.findById(id);
      if (!response) {
        return res.status(403).json({ success: false, message: 'user not found' });
      }
      response.daily_task.push(req.body);
     
      await response.save();
      res.status(200).json({
        success: true,
        message: 'Test data added to user successfully',
        data: response
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
   
  };
 
  const getAllTest = async (req, res) => {
    try {
      const response = await TestYourSelf.find()
        .populate("questions")
        .lean()
        .sort({ createdAt: -1 });

      const randomizedResponse = response.map((test) => ({
        ...test,
        questions: test.questions.sort(() => Math.random() - 0.5),
      }));

      res.status(200).json(randomizedResponse);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  
  
  const getAllQuiz = async (req, res) => {
    try {
      const response = await Quiz.find()
        .populate("questions")
        .lean()
        .sort({ createdAt: -1 });

      const randomizedResponse = response.map((quiz) => ({
        ...quiz,
        questions: quiz.questions.sort(() => Math.random() - 0.5),
      }));

      res.status(200).json(randomizedResponse);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  const getAllDailyTask = async (req, res) => {
    try {
      const response = await DailyTask.find().lean();
      if (!response?.length > 0) {
        return res
          .status(403)
          .json({ success: false, message: "No Daily Task Found" });
      }
      res.status(200).json(response);
    } catch (err) {
      res
        .status(500)
        .send({ success: false, message: "Inter Server Error", error: err });
    }
  };

  const getAllQuizTestCategory = async (req, res) => {
    try {
      const response = await QuizTestCategory.find().lean();
      if (!response?.length > 0) {
        return res
          .status(200)
          .json({ success: false, mesaage: "category Not Found" });
      }
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  module.exports ={userComplteteQuiz,userComplteteTest,userComplteteDailyTask,
    getAllTest,
    getAllQuizTestCategory,
    getAllQuiz,
    getAllDailyTask
  }