const TestYourSelf = require("../../model/test_yourself/text_yourself");
const TestYourSelfQuestion = require("../../model/test_yourself/testYourSelfQuestionModel");
const CreatTest = async (req, res) => {
  try {
    const response = await TestYourSelf.create(req.body);
    if (response) {
      res
        .status(201)
        .json({ success: true, data: response, message: "Test Created" });
    } else {
      res.status(400).json({ success: false, message: "Test not Created" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const UpdateTest = async (req, res) => {
  try {
    const response = await TestYourSelf.findByIdAndUpdate(
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
        .json({ success: false, message: "Test not found" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
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
const deleteTest = async (req, res) => {
  try {
    const response = await TestYourSelf.findByIdAndDelete(req.params.id);
    if (response) {
      res.status(200).json({ success: true, message: "Test deleted" });
    } else {
      res.status(404).json({ success: false, message: "Test not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const CreateTestQuestions = async (req, res) => {
  const { testId } = req.params;

  try {
    const response = await TestYourSelf.findById(testId);
    if (!response) {
      return res
        .status(404)
        .json({ success: false, message: "Test  Not Found" });
    }

    const question = await TestYourSelfQuestion.create(req.body);
    if (!question) {
      return res
        .status(400)
        .json({ success: false, message: "Test Question not Created" });
    }

    response.questions.push(question._id);
    await response.save();

    res.status(201).json({
      success: true,
      data: question,
      message: "Test Question Created",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSingleTestQuestions = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await TestYourSelfQuestion.findById(id);
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
const UpdateTstQuestion = async (req, res) => {
  try {
    const response = await TestYourSelfQuestion.findByIdAndUpdate(
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
        .json({ success: false, message: "Question not found" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
const deleteTestQuestion = async (req, res) => {
  try {
    const response = await TestYourSelfQuestion.findByIdAndDelete(
      req.params.id
    );
    if (response) {
      res.status(200).json({ success: true, message: "Question deleted" });
    } else {
      res.status(404).json({ success: false, message: "Question not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  CreatTest,
  getAllTest,
  getSingleTest,
  deleteTest,
  UpdateTest,
  CreateTestQuestions,

  UpdateTstQuestion,
  deleteTestQuestion,
  getSingleTestQuestions,
};
