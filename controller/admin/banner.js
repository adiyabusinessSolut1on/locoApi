const Banner = require("../../model/Banner");
const { UploadImage } = require("../../utils/imageUpload");
const { deleteImgFromFolder } = require("../../utils/removeImages");

exports.getBannerById = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (banner) {
            return res.status(200).json({ success: true, data: banner, message: "Banner fetched successfully" });
        }
        return res.status(404).json({ success: false, message: "Banner not found" });
    } catch (error) {
        console.log("error on getBannerById: ", error);
        return res.status(500).json({ message: error.message, error: error, success: false });
    }
}

exports.getBanner = async (req, res) => {
    try {
        const banners = await Banner.find();
        if (banners) {
            return res.status(200).json({ success: true, data: banners, message: "Banners fetched successfully" });
        }
        return res.status(404).json({ success: false, message: "No banners found" });
    } catch (error) {
        console.log("error on getBanner: ", error);
        return res.status(500).json({ message: error.message, error: error, success: false });
    }
}

exports.addBanner = async (req, res) => {
    const image = req.files?.image;
    const title = req.body?.title
    // const isLink = req.body?.isLink
    const link = req.body?.link

    try {
        const result = new Banner({ image, title, link })
        if (image) {
            const imagePath = await UploadImage(image, "banner");
            result.image = imagePath;
        }
        const banner = await result.save();
        if (banner) {
            return res.status(201).json({ success: true, data: banner, message: "Banner added successfully" });
        }
        return res.status(400).json({ success: false, message: "Failed to add banner" });
    } catch (error) {
        console.log("error on addBanner: ", error);
        return res.status(500).json({ message: error.message, error: error, success: false });
    }
}

exports.updateBanner = async (req, res) => {
    const id = req.params?.id
    const image = req.files?.image;
    const title = req.body?.title
    const link = req.body?.link

    try {
        const checkBanner = await Banner.findById(id)
        if (!checkBanner) {
            return res.status(404).json({ success: false, message: "Banner not found" });
        }
        if (title) checkBanner.title = title
        if (link) checkBanner.link = link
        if (image) {
            if (checkBanner.image) {
                await deleteImgFromFolder(checkBanner.image, "banner")
            }
            let imageName = await UploadImage(image, "banner")
            checkBanner.image = imageName
        }
        const result = await checkBanner.save()
        if (result) {
            return res.status(200).json({ success: true, data: result, message: "Banner updated successfully" });
        }
        return res.status(400).json({ success: false, message: "Failed to update banner" });

    } catch (error) {
        console.log("error on updateBanner: ", error);
        return res.status(500).json({ message: error.message, error: error, success: false });
    }
}

exports.deleteBanner = async (req, res) => {
    const id = req.params?.id
    try {
        const checkBanner = await Banner.findById(id)
        if (!checkBanner) {
            return res.status(404).json({ success: false, message: "Banner not found" });
        }
        if (checkBanner.image) {
            await deleteImgFromFolder(checkBanner.image, "banner")
        }
        const result = await Banner.findByIdAndDelete(id)
        if (result) {
            return res.status(200).json({ success: true, message: `Banner ${checkBanner?.title} deleted successfully` });
        }
        return res.status(400).json({ success: false, message: "Failed to delete banner" });
    } catch (error) {
        console.log("error on deleteBanner: ", error);
        return res.status(500).json({ message: error.message, error: error, success: false });
    }
}