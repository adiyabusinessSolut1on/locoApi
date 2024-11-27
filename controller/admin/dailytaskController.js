const DailyTask=require("../../model/daily-taskModel");

const dailyTaskCreate = async (req, res) => {
    try {
      const response = new DailyTask(req.body);
      const saveresponse = await response.save();
      res.status(201).json({
        success: true,
        data: saveresponse,
        message: "Daily Task Created",
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
  const dailyTaskgetAll = async (req, res) => {
    try {
      const response = await DailyTask.find();
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  const dailyTaskgetSingle = async (req, res) => {
    const {id}=req.params
    try {
      const response = await DailyTask.findById(id);
      if (!response) {
        return res
          .status(200)
          .json({ success: false, mesaage: "Daily Task Data Not Found" });
      }
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  const UpdatedailyTask= async (req, res) => {
    try {
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
    }
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
  