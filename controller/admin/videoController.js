const videCategory = require("../../model/videocategoryModel");
const Video = require("../../model/videoModel");
const { sendNotifcationToAllUsers } = require("../notification");

const createVideoCategory = async (req, res) => {
  try {
    const response = new videCategory(req.body);
    const saveresponse = await response.save();

    await sendNotifcationToAllUsers(title, content, "blog", req.userId)
    res.status(201).json({ success: true, data: saveresponse, message: "Video category Created" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAllVideoCategory = async (req, res) => {
  try {
    const response = await videCategory.find();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const UpdateVideoCategory = async (req, res) => {
  try {
    const response = await videCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (response) {
      res.status(200).json({ success: true, data: response, message: "Video Category Updated" });
    } else {
      res.status(404).json({ success: false, message: "Category not found" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteVideoCategory = async (req, res) => {
  try {
    const response = await videCategory.findByIdAndDelete(req.params.id);
    if (response) {
      res.status(200).json({ success: true, message: "Video Category deleted" });
    } else {
      res.status(404).json({ success: false, message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const UploadVideo = async (req, res) => {
  // console.log("req.body: ", req.body);

  try {
    const response = await Video.create(req.body);
    if (response) {
      res.status(201).json({ success: true, data: response, message: "Video Uploaded" });
    } else {
      res.status(400).json({ success: false, message: "Video not Uploaded" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const GetALLVideo = async (req, res) => {
  try {
    const response = await Video.find();
    if (!response.length > 0) {
      res.status(404).json({ success: false, message: "Video not found" });
    } else {
      res.status(200).json(response);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const GetVideoByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const response = await Video.find({ category: category });
    if (!response?.length > 0) {
      res.status(403).json({ success: false, message: "Video not found" });
    } else {
      res.status(200).json({ success: true, data: response });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const GetVideoById = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Video.findById(id);
    if (!response) {
      res.status(403).json({ success: false, message: "Video not found" });
    } else {
      res.status(200).json(response);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const UpdateVideo = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Video.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!response) {
      res.status(404).json({ success: false, message: "Video not found" });
    } else {
      res.status(203).json({ success: true, data: response, message: "Video updated" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteVideo = async (req, res) => {
  try {
    const response = await Video.findByIdAndDelete(req.params.id);
    if (response) {
      res.status(200).json({ message: "Video deleted" });
    } else {
      res.status(404).json({ message: "video not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createVideoCategory,
  getAllVideoCategory,
  UpdateVideoCategory,
  deleteVideoCategory,
  UploadVideo,
  GetALLVideo,
  GetVideoByCategory,
  GetVideoById,
  UpdateVideo,
  deleteVideo,
};
