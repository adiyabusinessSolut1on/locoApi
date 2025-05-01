const User = require("../model/user");
const TestYourSelf = require("../model/test_yourself/text_yourself");
const TestYourSelfQuestion = require("../model/test_yourself/testYourSelfQuestionModel");
const Quiz = require("../model/quiz/quizModel")
const DailyTask = require("../model/daily-taskModel")
const QuizQuestion = require("../model/quiz/quizquestions");
const QuizTestCategory = require("../model/quiz/quiz_testCategoryModel")


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
    const response = await Quiz.aggregate([
      {
        $sort: { createdAt: -1 },
      },
      {
        $lookup: {
          from: "quiz_questions", // 👈 this must match MongoDB **collection name**
          let: { questionIds: "$questions" }, // 👈 take questions array
          pipeline: [
            { $match: { $expr: { $in: ["$_id", "$$questionIds"] } } },
            { $sample: { size: 10 } }, // randomize questions (adjust size)
          ],
          as: "questions",
        },
      },
    ]);

    res.status(200).json(response);
  } catch (error) {
    console.error("Aggregation error:", error);
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

    /* 
    const response = await DailyTask.find({
  createdAt: { $gte: startOfDay, $lte: endOfDay },
  'userTasks.userId': userId,  // Filter by userId in userTasks
  $or: [
    { 'userTasks.status': 'completed' },  // Include tasks that are completed by the user
    { 'userTasks.userId': { $exists: false } }, // Include tasks that do not have a user assigned yet
  ]
})
.populate("video")
.populate("quiz")
.populate("test")
.populate("blog")
.populate("awareness");
    */
    const response = await DailyTask.find({ createdAt: { $gte: startOfDay, $lte: endOfDay } }).populate("video").populate("quiz").populate("test").populate("blog").populate("awareness");
    if (!response?.length > 0) {
      return res.status(404).json({ success: false, message: "No Daily Task Found" });
    }
    res.status(200).json(response);
  } catch (err) {
    res.status(500).send({ success: false, message: "Inter Server Error", error: err });
  }
};

const dailyTasksCompleted = async (req, res) => {
  // console.log(" ================================= Daily Task Completed ================================= ");
  // console.log("req.body: ", req.body);
  // console.log("req.params: ", req.params);
  // console.log("req.userId: ", req.userId);

  const dailyTaskId = req.params?.id; // dailyTaskId
  const type = req.body?.type; // Type of task to mark completed (e.g., blog, awareness, etc.)
  try {
    const checkUser = await User.findById(req.userId);
    if (!checkUser) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const dailyTask = await DailyTask.findById(dailyTaskId);
    if (!dailyTask) {
      return res.status(404).json({ success: false, message: "Daily Task not found" });
    }

    const userTaskIndex = dailyTask.userTasks.findIndex(
      (task) => task.userId.toString() === req.userId && task.taskType === type
    );

    if (userTaskIndex > -1) {
      // If the task already exists, update it
      dailyTask.userTasks[userTaskIndex].status = "completed";
      dailyTask.userTasks[userTaskIndex].completionDate = new Date();
    } else {
      // If the task does not exist, add a new task entry
      dailyTask.userTasks.push({
        userId: req.userId,
        status: "completed",
        completionDate: new Date(),
        taskType: type,
      });
    }
    // console.log("dailyTask:", dailyTask);

    await dailyTask.save();

    res.status(200).json({ success: true, message: `${type} task marked as completed.`, });
  } catch (error) {
    console.error("Error marking task as completed:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error });
  }
};


const getAllQuizTestCategory = async (req, res) => {
  try {
    const response = await QuizTestCategory.find().sort({ createdAt: -1 }).lean();
    if (!response?.length > 0) {
      return res.status(200).json({ success: false, mesaage: "category Not Found" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSingleDailyTask = async (req, res) => {
  const { id } = req.params
  const userId = req.userId
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

const getSingleDailyTaskSTatus = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const dailyTask = await DailyTask.findById(id)
      .populate("video")
      .populate("quiz")
      .populate("test")
      .populate("blog")
      .populate("awareness");

    if (!dailyTask) {
      return res.status(404).json({ success: false, message: "Daily Task not found" });
    }

    // Prepare a response with completion status for the logged-in user
    const userTaskStatuses = dailyTask.userTasks.reduce((acc, task) => {
      if (task.userId.toString() === userId) {
        acc[task.taskType] = {
          status: task.status,
          completionDate: task.completionDate,
        };
      }
      return acc;
    }, {});

    const response = {
      message: "Task fetched successfully",
      success: true,
      result: {
        ...dailyTask._doc,
        completionStatus: {
          video: userTaskStatuses.video || { status: "pending", completionDate: null },
          quiz: userTaskStatuses.quiz || { status: "pending", completionDate: null },
          test: userTaskStatuses.test || { status: "pending", completionDate: null },
          blog: userTaskStatuses.blog || { status: "pending", completionDate: null },
          awareness: userTaskStatuses.awareness || { status: "pending", completionDate: null },
        },
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching single daily task:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error });
  }
};



module.exports = {
  userComplteteQuiz, userComplteteTest, userComplteteDailyTask,
  getAllTest,
  getAllQuizTestCategory,
  getAllQuiz,
  getAllDailyTask,
  getSingleDailyTask,
  dailyTasksCompleted,
  getSingleDailyTaskSTatus
}