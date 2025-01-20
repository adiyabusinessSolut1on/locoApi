const TestYourSelf = require("../../model/test_yourself/text_yourself");
const TestYourSelfQuestion = require("../../model/test_yourself/testYourSelfQuestionModel");
const { UploadImage } = require("../../utils/imageUpload");
const { deleteImgFromFolder } = require("../../utils/removeImages");


const CreatTest = async (req, res) => {
  try {
    const response = await TestYourSelf.create(req.body);
    if (response) {
      res.status(201).json({ success: true, data: response, message: "Test Created" });
    } else {
      res.status(400).json({ success: false, message: "Test not Created" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const UpdateTest = async (req, res) => {
  try {
    const response = await TestYourSelf.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, });
    if (response) {
      return res.status(200).json({ success: true, data: response, message: "Quiz Updated", });
    } else {
      return res.status(404).json({ success: false, message: "Test not found" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
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


const getSingleTest = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await TestYourSelf.findById(id).populate("questions");
    if (!response) {
      return res.status(200).json({ success: false, mesaage: "Test Not Found" });
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
  // console.log(" ==================================== createTestQuestions =================================");

  const { testId } = req.params;
  const name = req.body?.name
  const options = req.body?.options
  const predicted_result = req.body?.predicted_result
  const answer_description = req.body?.answer_description
  const image = req.files?.image


  try {
    const response = await TestYourSelf.findById(testId);

    if (!response) {
      return res.status(404).json({ success: false, message: "Test  Not Found" });
    }
    const question = new TestYourSelfQuestion({ name, options, predicted_result, answer_description })

    if (image) {
      question.image = await UploadImage(image, "testYourSelf")
    }

    await question.save();
    response.questions.push(question._id);
    await response.save()

    res.status(201).json({ success: true, data: "question", message: "Test Question Created", });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSingleTestQuestions = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await TestYourSelfQuestion.findById(id);
    if (!response) {
      return res.status(403).json({ success: false, message: "Question Not Found" });
    }

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const UpdateTstQuestion = async (req, res) => {
  const image = req.files.image
  try {

    const checkTestQuestion = await TestYourSelfQuestion.findById(req.params.id);
    if (!checkTestQuestion) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }
    if (image) {
      let oldeImage = checkTestQuestion.image
      let imageName = await UploadImage(image, "testYourSelf")
      req.body.image = imageName
      if (oldeImage) {
        await deleteImgFromFolder(oldeImage, "testYourSelf")
      }
    }
    const response = await TestYourSelfQuestion.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, });
    if (response) {
      return res.status(200).json({ success: true, data: response, message: "Quiz Updated", });
    } else {
      return res.status(404).json({ success: false, message: "Question not found" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteTestQuestion = async (req, res) => {
  try {
    const response = await TestYourSelfQuestion.findByIdAndDelete(req.params.id);
    // const response = "ok"

    if (response.image) {
      await deleteImgFromFolder(response.image, "testYourSelf") // Delete image from folder  // you need to create a function deleteImgFromFolder in utils/imageUpload.js file.  // it will take image name and folder name as parameters.  // after deleting image from folder, it will delete image from MongoDB collection.  // This is just a basic example.  // In a real-world application, you need to handle the error cases and make sure the image is deleted from both MongoDB and the folder.  // Also, you need to handle the case when the image does not exist in the folder.  // Make sure you have the necessary permissions and error handling in place.  // If you're using AWS S3, you can use their SDK to delete the image from the bucket.  // You can find more information in their documentation.  // And remember to update the image field in the TestYourSelfQuestion model to null after deleting the
    }
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
