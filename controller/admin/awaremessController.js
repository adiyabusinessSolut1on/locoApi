const AwarenessCategory = require("../../model/awareness/awarenessCategoryModel");
const Awareness = require("../../model/awareness/awarenessModel");
const { UploadImage } = require("../../utils/imageUpload");
const { deleteImgFromFolder } = require("../../utils/removeImages");
const mongoose = require("mongoose");

const createCategory = async (req, res) => {
  // console.log("================== createCategory =================");
  // console.log("req.body: ", req.body);
  // console.log("req.files: ", req.files);
  const name = req.body?.name
  const image = req.files?.image


  try {
    const response = new AwarenessCategory({ name });
    if (image) {
      const fileName = await UploadImage(image, "awarenessCategory");
      response.image = fileName;
    }

    const saveresponse = await response.save();
    res.status(201).json({ success: true, data: saveresponse, message: "Awareness category Created", });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const UpdateCategory = async (req, res) => {
  // const name = req.body?.name
  const image = req.files?.image

  try {
    const checkAwarenessCategory = await AwarenessCategory.findById(req.params.id)
    if (!checkAwarenessCategory) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    if (image) {
      // const oldImage = checkAwarenessCategory.image;
      const fileName = await UploadImage(image, "awarenessCategory");
      req.body.image = fileName;
      if (checkAwarenessCategory.image) {
        await deleteImgFromFolder(checkAwarenessCategory.image, "awarenessCategory");
      }
    }
    const response = await AwarenessCategory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, });
    if (response) {
      return res.status(200).json({ success: true, data: response, message: "Awareness Category Updated", });
    }
    return res.status(404).json({ success: false, message: "Category not found" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAllCategory = async (req, res) => {
  try {
    const response = await AwarenessCategory.find().sort({ createdAt: -1 });
    if (!response?.length > 0) {
      return res.status(404).json({ success: false, message: "Category Not Found" });
    }
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {

    const checkAwarenessCategory = await AwarenessCategory.findById(req.params.id)
    if (!checkAwarenessCategory) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    if (checkAwarenessCategory.image) {
      await deleteImgFromFolder(checkAwarenessCategory.image, "awarenessCategory");
    }

    const response = await AwarenessCategory.findByIdAndDelete(req.params.id);
    if (response) {
      return res.status(200).json({ success: true, message: "Awareness Category deleted" });
    }
    res.status(404).json({ success: false, message: "Category not found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const CreateAwareNess = async (req, res) => {
  // console.log(" ========================== CreateAwareNess ==========================")
  const image = req.files?.image
  try {
    if (image) {
      const imagePath = await UploadImage(image, "awareness");
      req.body.image = imagePath;
    }
    const response = await Awareness.create(req.body);
    if (response) {
      return res.status(201).json({ success: true, data: response, message: "Awareness Uploaded" });
    } else {
      return res.status(400).json({ success: false, message: "Awareness not Uploaded" });
    }
    // res.status(400).json({ success: false, message: "Awareness not Uploaded" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllAwareness = async (req, res) => {
  try {
    const response = await Awareness.find().sort({ createdAt: -1 }).populate("category")
    if (!response?.length > 0) {
      return res.status(403).json({ success: false, message: "No Awareness Found" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAwarenessById = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Awareness.findById(id).populate("category")
    if (!response) {
      return res.status(403).json({ success: false, message: "No Awareness Found" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAwarenessByCategoryById = async (req, res) => {
  const id = req.params?.id
  try {
    const result = await Awareness.find({ category: id }).sort({ createdAt: -1 }).populate("category")
    if (result) {
      return res.status(200).json({ message: "Ok", data: result, success: true })
    }
    return res.status(404).json({ message: "No data found!", success: false })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getAwarenessByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const response = await Awareness.find({ category: new mongoose.Types.ObjectId(category) }).sort({ createdAt: -1 }).populate("category");

    if (!response || response.length === 0) {
      return res.status(404).json({ success: false, message: "No Awareness Found" });
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Error in getAwarenessByCategory:", error);
    res.status(500).json({ message: error.message });
  }
};

const UpdateAwareness = async (req, res) => {
  // console.log(" ========================== UpdateAwareNess ==========================")
  // console.log("req.body: ", req.body);
  // console.log("req.files: ", req.files);

  try {
    const checkAwareness = await Awareness.findById(req.params.id).populate("category")

    if (!checkAwareness) {
      return res.status(404).json({ success: false, message: "Awareness not found" });
    }
    if (req.files?.image) {
      const imagePath = await UploadImage(req.files.image, "awareness");
      req.body.image = imagePath;
      if (checkAwareness.image) {
        await deleteImgFromFolder(checkAwareness.image, "awareness");
      }
    }
    const response = await Awareness.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, });
    if (response) {
      return res.status(200).json({ success: true, data: response, message: "Awareness  Updated", });
    }
    return res.status(404).json({ success: false, message: "Awareness not found" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteAwareness = async (req, res) => {
  try {
    const checkAwareness = await Awareness.findById(req.params.id)

    if (!checkAwareness) {
      return res.status(404).json({ success: false, message: "Awareness not found" });
    }
    if (checkAwareness.image) {
      await deleteImgFromFolder(checkAwareness.image, "awareness");
    }

    const response = await Awareness.findByIdAndDelete(req.params.id);
    if (response) {
      return res.status(200).json({ success: true, message: "Awareness  deleted" });
    } else {
      return res.status(404).json({ success: false, message: "Awareness not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getIdFirstAwareness = async (req, res) => {
  const id = req.params?.id;

  try {
    const objectId = new mongoose.Types.ObjectId(id); // ✅ convert to ObjectId

    const response = await Awareness.aggregate([
      {
        $facet: {
          first: [
            { $match: { _id: objectId } },
            {
              $lookup: {
                from: "awarenesscategories", // ✅ double-check collection name (usually plural)
                localField: "category",
                foreignField: "_id",
                as: "category"
              }
            },
            { $unwind: "$category" }
          ],
          others: [
            { $match: { _id: { $ne: objectId } } },
            { $sort: { createdAt: -1 } },
            {
              $lookup: {
                from: "awarenesscategories", // ✅ same as above
                localField: "category",
                foreignField: "_id",
                as: "category"
              }
            },
            { $unwind: "$category" }
          ]
        }
      },
      {
        $project: {
          combined: { $concatArrays: ["$first", "$others"] }
        }
      },
      { $unwind: "$combined" },
      { $replaceRoot: { newRoot: "$combined" } }
    ]);

    return res.status(200).json({ message: "Ok", data: response, success: true });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
  }
};

const getAll_Awareness = async (req, res) => {

  try {
    const response = await Awareness.find().sort({ createdAt: -1 }).lean().populate("category")
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllAwarenessPagination = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default to page 1, limit 10

    const response = await Awareness.find().populate("category").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit)).lean()
    // const response = await Awareness.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit)).lean()

    const totalCount = await Awareness.countDocuments(); // Total records

    res.status(200).json({ data: response, currentPage: parseInt(page), totalPages: Math.ceil(totalCount / limit), totalRecords: totalCount, });
  } catch (error) {
    console.log("error: ", error)
    res.status(500).json({ message: error.message });
  }
}

const getSingleAwareness = async (req, res) => {
  const { id } = req.params
  try {
    const response = await Awareness.findById(id).populate("category")
    if (!response) return res.status(404).json({ success: false, message: 'Awareness Data Not Found' });

    return res.status(200).json({ success: true, data: response })
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
module.exports = {
  getSingleAwareness,
  getAll_Awareness,
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
  getAllAwarenessPagination,
  getAwarenessByCategoryById,
  getIdFirstAwareness,
};
