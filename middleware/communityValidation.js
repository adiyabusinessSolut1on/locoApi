

exports.addCommunityValidation = async (req, res, next) => {
    const content = req.body?.content

    const files = req.files

    try {
        if (!content) {
            return res.status(400).json({ message: "Content is required", success: false });
        }
        if (!files) {
            return res.status(400).json({ message: "Images/videos are required", success: false });
        }

        const images = Array.isArray(files.images) ? files.images : [files.images];
        const videos = Array.isArray(files.videos) ? files.videos : [files.videos];
        // console.log("files.length: ", images);

        if (!images.length > 0 && !videos.length > 0) {
            return res.status(400).json({ message: "Please upload at least one image/video", success: false });
        }
        next();
    } catch (error) {
        console.log("error on addCommunityValidation: ", error);
        return res.status(500).json({ message: error.message, error: error, success: false });
    }
}