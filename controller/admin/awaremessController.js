const AwarenessCategory = require("../../model/awareness/awarenessCategoryModel");
const Awareness = require("../../model/awareness/awarenessModel");
const { sendNotifcationToAllUsers } = require("../notification");

const createCategory = async (req, res) => {
  try {
    const response = new AwarenessCategory(req.body);
    const saveresponse = await response.save();
    res.status(201).json({
      success: true,
      data: saveresponse,
      message: "Awareness category Created",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
const UpdateCategory = async (req, res) => {
  try {
    const response = await AwarenessCategory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, });
    if (response) {
      return res.status(200).json({ success: true, data: response, message: "Awareness Category Updated", });
    } else {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
const getAllCategory = async (req, res) => {

  try {
    const response = await AwarenessCategory.find();

    if (!response?.length > 0) {
      return res.status(404).json({ success: false, mesaage: "category Not Found" });
    }
    return res.status(200).json({ success: true, mesaage: "category", data: response });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const deleteCategory = async (req, res) => {
  try {
    const response = await AwarenessCategory.findByIdAndDelete(req.params.id);
    if (response) {
      return res.status(200).json({ success: true, message: "Awareness Category deleted" });
    }
    return res.status(404).json({ success: false, message: "Category not found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const CreateAwareNess = async (req, res) => {
  try {
    const response = await Awareness.create(req.body);
    if (response) {

      await sendNotifcationToAllUsers(req?.body?.title, req.body?.description, "awareness", req.userId, req?.body?.image)
      return res.status(201).json({ success: true, data: response, message: "Awareness Uploaded" });
    }
    return res.status(400).json({ success: false, message: "Awareness not Uploaded" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getAllAwareness = async (req, res) => {
  try {
    const response = await Awareness.find();
    if (!response?.length > 0) {
      return res.status(403).json({ success: false, message: "No Awareness Found" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getAwarenessById = async (req, res) => {
  // console.log("calling................................................................");

  const { id } = req.params;
  try {
    const response = await Awareness.findById(id);
    if (!response) {
      return res.status(403).json({ success: false, message: "No Awareness Found" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAwarenessByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const response = await Awareness.find({ category: category });
    if (!response?.length > 0) {
      return res
        .status(403)
        .json({ success: false, message: "No Awareness Found" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const UpdateAwareness = async (req, res) => {
  try {
    const response = await Awareness.findByIdAndUpdate(
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
        message: "Awareness  Updated",
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Awareness not found" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
const deleteAwareness = async (req, res) => {
  try {
    const response = await Awareness.findByIdAndDelete(req.params.id);
    if (response) {
      res.status(200).json({ success: true, message: "Awareness  deleted" });
    } else {
      res.status(404).json({ success: false, message: "Awareness not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createCategory,
  UpdateCategory,
  getAllCategory,
  deleteCategory,
  CreateAwareNess,
  getAllAwareness,
  getAwarenessById,
  getAwarenessByCategory,
  UpdateAwareness,
  deleteAwareness,
};
