const videCategory = require("../../model/videocategoryModel");
const Video = require("../../model/videoModel");
const { UploadImage } = require("../../utils/imageUpload");
const { deleteImgFromFolder } = require("../../utils/removeImages");

const createVideoCategory = async (req, res) => {
  try {
    const response = new videCategory(req.body);
    const saveresponse = await response.save();
    res.status(201).json({ success: true, data: saveresponse, message: "Video category Created", });
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
      res
        .status(200)
        .json({
          success: true,
          data: response,
          message: "Video Category Updated",
        });
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
      res
        .status(200)
        .json({ success: true, message: "Video Category deleted" });
    } else {
      res.status(404).json({ success: false, message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const UploadVideo = async (req, res) => {

  const category = req.body.category;
  const title = req.body?.title;
  const slug = req.body?.slug;
  const tags = req.body?.tags;
  const description = req.body?.description;
  const isYoutube = req.body?.isYoutube;

  const thumnail = req.files?.thumnail

  const video = req.files?.url

  const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];


  try {
    const result = new Video({ title, slug, tags: tagsArray, description, isYoutube, category })
    if (thumnail) {
      const imageUrl = await UploadImage(thumnail, 'uploadThumbnail');
      result.thumnail = imageUrl
    }
    if (isYoutube == 'true') {
      result.url = req.body?.url
    } else {
      if (video) {
        const videoName = await UploadImage(video, "uploadVideo")
        result.url = videoName
      }
    }
    const savedVideo = await result.save();
    if (savedVideo) {
      return res.status(200).json({ success: true, data: savedVideo, message: "Video saved successfully." })
    }
    return res.status(400).json({ success: false, message: "Video not saved" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const GetALLVideo = async (req, res) => {
  try {
    const response = await Video.find().sort({ createdAt: -1 });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const GetVideoByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    if (!category)
      return res.status(403).json({ success: false, message: "Video not found" });
    const response = await Video.find({ category: category });

    res.status(200).json({ success: true, data: response });
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

  // console.log("req.body: ", req.body);
  // console.log("req.files: ", req.files);


  const category = req.body.category;
  const title = req.body?.title;
  const slug = req.body?.slug;
  const tags = req.body?.tags
  const description = req.body?.description;
  const isYoutube = req.body?.isYoutube;

  const thumnail = req.files?.thumnail

  const video = req.files?.url
  const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];

  try {

    const result = await Video.findById(id)

    
    if (title) result.title = title;
    if (slug) result.slug = slug;
    if (tagsArray) result.tags = tagsArray;
    if (description) result.description = description;
    if (isYoutube) result.isYoutube = isYoutube;
    if (category) result.category = category;

    if (thumnail) {
      let oldImage = result.thumnail
      const imageUrl = await UploadImage(thumnail, 'uploadThumbnail');
      result.thumnail = imageUrl
      if (oldImage) {
        await deleteImgFromFolder(oldImage, 'uploadThumbnail');
      }
    }
    if (isYoutube == 'true') {
      result.url = req.body?.url
    } else {
      if (video) {
        let oldVideo
        if (result?.isYoutube == 'true') {
          oldVideo = result.url
        }
        const videoName = await UploadImage(video, "uploadVideo")
        result.url = videoName
        if (oldVideo) {
          await deleteImgFromFolder(oldVideo, 'uploadVideo');
        }
      }
    }

    const savedVideo = await result.save();
    if (savedVideo) {
      return res.status(200).json({ success: true, data: savedVideo, message: "Video updated successfully." })
    }
    return res.status(400).json({ success: false, message: "Failed to update video" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteVideo = async (req, res) => {

  try {
    const response = await Video.findByIdAndDelete(req.params.id);
    if (response) {
      if (response.thumnail) {
        await deleteImgFromFolder(response.thumnail, 'uploadThumbnail');
      }
      if (response.isYoutube == false) {
        if (response.url) {
          await deleteImgFromFolder(response.url, 'uploadVideo');
        }
      }
      return res.status(200).json({ success: true, message: "Video deleted" });
    } else {
      return res.status(404).json({ success: false, message: "video not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
