const Quiz = require("../../model/quiz/quizModel");
const QuizQuestion = require("../../model/quiz/quizquestions");
const QuizTestCategory = require("../../model/quiz/quiz_testCategoryModel");
const { UploadImage } = require("../../utils/imageUpload");
const { deleteImgFromFolder } = require("../../utils/removeImages");
const CreatQuiz = async (req, res) => {
  try {
    const response = await Quiz.create(req.body);
    if (response) {
      res
        .status(201)
        .json({ success: true, data: response, message: "Quiz Created" });
    } else {
      res.status(400).json({ success: false, message: "Quiz not Created" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const UpdateQuiz = async (req, res) => {
  try {
    const response = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (response) {
      return res.status(200).json({
        success: true,
        data: response,
        message: "Quiz Updated",
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAllQuiz = async (req, res) => {
  try {
    const response = await Quiz.find().populate("questions");
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
const deleteQuiz = async (req, res) => {
  try {
    const response = await Quiz.findByIdAndDelete(req.params.id);
    if (response) {
      res.status(200).json({ success: true, message: "Quiz deleted" });
    } else {
      res.status(404).json({ success: false, message: "Quiz not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const CreateQuizQuestions = async (req, res) => {
  const { quizId } = req.params;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz Not Found" });
    }

    const question = await QuizQuestion.create(req.body);
    if (!question) {
      return res.status(400).json({ success: false, message: "Quiz Question not Created" });
    }

    quiz.questions.push(question._id);
    await quiz.save();

    res.status(201).json({ success: true, data: question, message: "Quiz Question Created", });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const getSingleQuizQuestions = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await QuizQuestion.findById(id);
    if (!response) {
      return res
        .status(403)
        .json({ success: false, message: "Question Not Found" });
    }

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const UpdateQuizQuestion = async (req, res) => {
  try {
    const response = await QuizQuestion.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (response) {
      return res.status(200).json({
        success: true,
        data: response,
        message: "Quiz Updated",
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteQuizQuestion = async (req, res) => {
  try {
    const response = await QuizQuestion.findByIdAndDelete(req.params.id);
    if (response) {
      res.status(200).json({ success: true, message: "Quiz deleted" });
    } else {
      res.status(404).json({ success: false, message: "Quiz not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createQuizTestCategory = async (req, res) => {
  const image = req.files?.image
  try {
    if (image) {
      const imagePath = await UploadImage(image, "quizCategory");
      req.body.image = imagePath;
    }

    const response = new QuizTestCategory(req.body);
    const saveresponse = await response.save();
    res.status(201).json({ success: true, data: saveresponse, message: "category Created", });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


const UpdateQuizTestCategory = async (req, res) => {
  const image = req.files?.image

  try {
    const checkQuizCategory = await QuizTestCategory.findById(req.params.id)
    if (image) {
      let oldeImage = checkQuizCategory.image
      req.body.image = await UploadImage(image, "quizCategory");
      if (oldeImage) {
        await deleteImgFromFolder(oldeImage, "quizCategory");
      }
    }
    const response = await QuizTestCategory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, });
    if (response) {
      return res.status(200).json({ success: true, data: response, message: "Category Updated", });
    } else {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAllQuizTestCategory = async (req, res) => {
  try {
    const response = await QuizTestCategory.find().sort({ createdAt: -1 });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteQuizTestCategory = async (req, res) => {
  try {
    const response = await QuizTestCategory.findByIdAndDelete(req.params.id);
    if (response.image) {
      await deleteImgFromFolder(response.image, "quizCategory");
    }
    if (response) {
      res.status(200).json({ success: true, message: " Category deleted" });
    } else {
      res.status(404).json({ success: false, message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createQuizTestCategory,
  UpdateQuizTestCategory,
  getAllQuizTestCategory,
  deleteQuizTestCategory,
  CreatQuiz,
  UpdateQuiz,
  getAllQuiz,
  getSingleQuiz,
  deleteQuiz,
  CreateQuizQuestions,
  UpdateQuizQuestion,
  deleteQuizQuestion,
  getSingleQuizQuestions,
};
