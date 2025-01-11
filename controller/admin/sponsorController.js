const { findByIdAndUpdate } = require("../../model/awareness/awarenessCategoryModel");
const SponsorCompany = require("../../model/sponsor/company");
const SponsorProduct = require("../../model/sponsor/product");
const { UploadImage } = require("../../utils/imageUpload");
const { deleteImgFromFolder } = require("../../utils/removeImages");


const createcompany = async (req, res) => {
  // const name = req.body?.name
  // const type = req.body?.type
  // const image = req.body?.image
  // const link = req.body?.link
  // const video = req.body?.video
  // const description = req.body?.description
  // const active = req.body?.active
  // const isYoutube = req.body?.isYoutube

  const isYoutube = req.body?.isYoutube
  const image = req.files?.image
  const video = req.files?.video

  try {
    if (isYoutube == 'false') {
      if (video) {
        req.body.video = await UploadImage(video, "sponsorVideo")
      }
    }

    if (image) {
      req.body.image = await UploadImage(image, "sponsorImage");
    }
    const response = await SponsorCompany.create(req.body);
    if (response) {
      res.status(201).json({ success: true, data: response, message: "Sponsor Company Uploaded", });
    } else {
      res.status(400).json({ success: false, message: "Sponsor Company not Uploaded" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getAllcompany = async (req, res) => {
  try {
    const response = await SponsorCompany.find().sort({ createdAt: -1 }).populate("products");
    if (!response?.length > 0) {
      return res.status(403).json({ success: false, message: "Sponsor Company Not Found" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSinglecompany = async (req, res) => {
  const { id } = req.params
  try {
    const response = await SponsorCompany.findById(id).populate("products");
    if (!response) {
      return res.status(403).json({ success: false, message: "Sponsor Company Not Found" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const UpdateCompany = async (req, res) => {

  const name = req.body?.name
  const type = req.body?.type
  const link = req.body?.link
  const description = req.body?.description
  const active = req.body?.active

  const isYoutube = req.body?.isYoutube
  const image = req.files?.image
  const video = req.files?.video


  try {
    const checkSponsor = await SponsorCompany.findById(req.params.id)

    if (isYoutube == 'false') {
      let oldVideo = checkSponsor.video
      if (video) {
        checkSponsor.video = await UploadImage(video, "sponsorVideo")
      }
      if (!checkSponsor.isYoutube) {
        if (oldVideo) {
          await deleteImgFromFolder(oldVideo, "sponsorVideo");
        }
      }
    } else {
      let oldVideo = checkSponsor.video
      checkSponsor.video = req.body?.video
      if (!checkSponsor.isYoutube) {
        if (oldVideo) {
          await deleteImgFromFolder(oldVideo, "sponsorVideo");
        }
      }
    }

    if (image) {
      let oldeImage = checkSponsor.image
      checkSponsor.image = await UploadImage(image, "sponsorImage");
      if (oldeImage) {
        await deleteImgFromFolder(oldeImage, "sponsorImage");
      }
    }

    if (name) checkSponsor.name = name
    if (type) checkSponsor.type = type
    if (link) checkSponsor.link = link
    if (description) checkSponsor.description = description
    if (active) checkSponsor.active = active
    if (isYoutube) checkSponsor.isYoutube = isYoutube

    const response = await checkSponsor.save()


    // const response = await SponsorCompany.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, });
    if (response) {
      return res.status(200).json({ success: true, data: response, message: "Sponsor Company  Updated", });
    } else {
      return res.status(404).json({ success: false, message: "Sponsor Company not found" });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
const deleteCompany = async (req, res) => {
  try {
    const response = await SponsorCompany.findByIdAndDelete(req.params.id);
    if (response.image) {
      await deleteImgFromFolder(response.image, "sponsorImage");
    }
    if (!response.isYoutube) {
      if (response.video) {
        await deleteImgFromFolder(response.video, "sponsorVideo");
      }
    }
    if (response) {
      res.status(200).json({ success: true, message: "Sponsor Company  deleted" });
    } else {
      res.status(404).json({ success: false, message: "Sponsor Company not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const createProduct = async (req, res) => {

  const { companyId } = req.body;
  try {
    const response = await SponsorProduct.create(req.body);
    if (response) {
      await SponsorCompany.findByIdAndUpdate(companyId, {
        $push: { products: response._id }
      })
      return res
        .status(201)
        .json({
          success: true,
          data: response,
          message: "Sponsor Product Uploaded",
        });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Sponsor Product not Uploaded" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAllProsucts = async (req, res) => {
  try {
    const response = await SponsorProduct.find();
    if (!response?.length > 0) {
      return res
        .status(403)
        .json({ success: false, message: "Sponsor Product Not Found" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const UpdateProduct = async (req, res) => {
  try {
    const response = await SponsorProduct.findByIdAndUpdate(
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
        message: "Sponsor Product  Updated",
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Sponsor Product not found" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const response = await SponsorProduct.findByIdAndDelete(req.params.id);
    if (response) {
      res
        .status(200)
        .json({ success: true, message: "Sponsor Company  deleted" });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Sponsor Company not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getSingleProduct = async (req, res) => {
  const { id } = req.params
  try {
    const response = await SponsorProduct.findById(id);
    if (!response?.length > 0) {
      return res
        .status(403)
        .json({ success: false, message: "Sponsor Company Not Found" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createcompany,
  getAllcompany,
  UpdateCompany,
  deleteCompany,
  createProduct,
  getAllProsucts,
  UpdateProduct,
  deleteProduct,
  getSinglecompany,
  getSingleProduct
};
