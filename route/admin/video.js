const express = require("express");
const router = express.Router();
const { isAdmin } = require("../../middleware/rolebaseuserValidate");
const { createVideoCategory, getAllVideoCategory, UpdateVideoCategory, deleteVideoCategory, UploadVideo, GetALLVideo, GetVideoByCategory, GetVideoById, UpdateVideo, deleteVideo, } = require("../../controller/admin/videoController");


router.post("/video/create-category", isAdmin, createVideoCategory);
router.put("/video/update-category/:id", isAdmin, UpdateVideoCategory);
router.get("/video/get-category", isAdmin, getAllVideoCategory);
router.delete("/video/delete-category/:id", isAdmin, deleteVideoCategory);

router.post("/video/upload", isAdmin, UploadVideo);
router.get("/video/get-all-video", isAdmin, GetALLVideo);
router.get("/video/get-video-bycategory/:category", isAdmin, GetVideoByCategory);
router.get("/video/get-video-byid/:id", isAdmin, GetVideoById);
router.put("/video/update/:id", isAdmin, UpdateVideo);
router.delete("/video/delete/:id", isAdmin, deleteVideo);

module.exports = router;
