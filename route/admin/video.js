const express = require("express");
const router = express.Router();
const {
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
} = require("../../controller/admin/videoController");


router.post("/video/create-category", createVideoCategory);
router.put("/video/update-category/:id", UpdateVideoCategory);
router.get("/video/get-category", getAllVideoCategory);
router.delete("/video/delete-category/:id", deleteVideoCategory);

router.post("/video/upload", UploadVideo);
router.get("/video/get-all-video", GetALLVideo);
router.get("/video/get-video-bycategory/:category", GetVideoByCategory);
router.get("/video/get-video-byid/:id", GetVideoById);
router.put("/video/update/:id", UpdateVideo);
router.delete("/video/delete/:id", deleteVideo);

module.exports = router;
