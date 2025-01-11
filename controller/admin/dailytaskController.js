const DailyTask = require("../../model/daily-taskModel");

const dailyTaskCreate = async (req, res) => {

  const { dailyTask, awarenessTag, blogTag, videoTag, quizTag, testTag } = req.body;
  try {

    // Transform data to match schema
    const newDailyTask = new DailyTask({
      title: dailyTask.title,
      content: dailyTask.content,
      awareness: awarenessTag.map(tag => tag._id), // Extract ObjectId from awarenessTag
      blog: blogTag.map(tag => tag._id),          // Extract ObjectId from blogTag
      video: videoTag.map(tag => tag._id),        // Extract ObjectId from videoTag
      quiz: quizTag.map(tag => tag._id),          // Extract ObjectId from quizTag
      test: testTag.map(tag => tag._id),          // Extract ObjectId from testTag
      type: "awareness" // Assign a default type or dynamically determine it if necessary
    });

    // Save the new task in the database
    const savedTask = await newDailyTask.save();

    // Send response
    return res.status(200).json({ success: true, message: "Daily task created successfully!", data: savedTask });
    // const response = new DailyTask(req.body);
    // const saveresponse = await response.save();


    // const saveresponse = "no response"
    // return res.status(201).json({ success: true, data: saveresponse, message: "Daily Task Created", });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
  // console.log("req.body: ", req.body);

  /* try {
    const response = new DailyTask(req.body);
    const saveresponse = await response.save();
    res.status(201).json({ success: true, data: saveresponse, message: "Daily Task Created", });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  } */
};

const dailyTaskgetAll = async (req, res) => {
  // console.log("==================================== dailyTaskGetAll =======================================================")
  try {
    const response = await DailyTask.find();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const dailyTaskgetSingle = async (req, res) => {
  const { id } = req.params

  try {
    const response = await DailyTask.findById(id).populate("video").populate("quiz").populate("test").populate("blog").populate("awareness");
    if (!response) {
      return res.status(200).json({ success: false, mesaage: "Daily Task Data Not Found" });
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  /* const { id } = req.params
  try {
    const response = await DailyTask.findById(id);
    if (!response) {
      return res.status(200).json({ success: false, mesaage: "Daily Task Data Not Found" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  } */
};
const UpdatedailyTask = async (req, res) => {
  // console.log("req.body: ", req.body);

  const { dailyTask, awarenessTag, blogTag, videoTag, quizTag, testTag } = req.body;

  try {

    // Validate if `req.params.id` exists
    const checkDailyTask = await DailyTask.findById(req.params.id);
    // console.log("dailyTask: ", dailyTask);

    if (!checkDailyTask) {
      return res.status(404).json({ success: false, message: "Daily Task not found" });
    }

    const updatedFields = {
      title: dailyTask?.title,
      content: dailyTask?.content,
      awareness: awarenessTag?.map((item) => item._id), // Extract `_id` from awareness
      blog: blogTag?.map((item) => item._id), // Extract `_id` from blog
      video: videoTag?.map((item) => item._id), // Extract `_id` from video
      quiz: quizTag?.map((item) => item._id), // Extract `_id` from quiz
      test: testTag?.map((item) => item._id), // Extract `_id` from test
    };

    // console.log("updatedFields: ", updatedFields)

    const updatedTask = await DailyTask.findByIdAndUpdate(req.params.id, updatedFields, { new: true, runValidators: true });

    if (updatedTask) {
      return res.status(200).json({ success: true, data: updatedTask, message: "Daily Task Updated", });
    }
    return res.status(404).json({ success: false, message: "Failed to update daily task" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
  /* try {
    const response = await DailyTask.findByIdAndUpdate(
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
        message: "Daily Task Updated",
      });
    } else {
      return res.status(404).json({ success: false, message: "Daily Task not found" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  } */
};
const DeletedailyTask = async (req, res) => {
  try {
    const response = await DailyTask.findByIdAndDelete(req.params.id);
    if (response) {
      res
        .status(200)
        .json({ success: true, message: "Daily Task deleted" });
    } else {
      res.status(404).json({ success: false, message: "Daily TAsk not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  dailyTaskCreate,
  dailyTaskgetAll,
  dailyTaskgetSingle,
  UpdatedailyTask,
  DeletedailyTask
};
