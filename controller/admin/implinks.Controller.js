const ImportantLinks = require("../../model/implinksModel");
const { UploadImage } = require("../../utils/imageUpload");
const { deleteImgFromFolder } = require("../../utils/removeImages");
const Create = async (req, res) => {
  const title = req.body?.title
  const donwloadable = req.body?.donwloadable
  const isExternal = req.body?.isExternal
  let link;
  if (isExternal == "true") {
    console.log("isExternal: if", isExternal);

    link = req.body?.link
  } else {
    console.log("isExternal: else", isExternal);
    link = req.files?.link
  }


  try {
    const result = new ImportantLinks({ title, donwloadable, isExternal })
    if (isExternal == "true") {
      result.link = link;
    } else {
      if (link) {
        const docName = await UploadImage(link, "importantLink")
        result.link = docName
      }
    }
    const response = await result.save()
    return res.status(201).json({ success: true, data: response, message: "Important Link/Document Created", });

    // const response = new ImportantLinks(req.body);
    // const saveresponse = await response.save();
    // res.status(201).json({ success: true, data: "response", message: "Important Link/Document Created", });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const response = await ImportantLinks.find().sort({ createdAt: -1 });
    if (!response) {
      return res.status(200).json({ success: false, message: "Important Links/Documents Not Found" });
    }
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSingle = async (req, res) => {
  const { id } = req.params
  try {
    const response = await ImportantLinks.findById(id);
    if (!response) {
      return res.status(200).json({ success: false, mesaage: "Important Links/Document Not Found" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const Update = async (req, res) => {
  const id = req.params?.id

  const title = req.body?.title
  const donwloadable = req.body?.donwloadable
  const isExternal = req.body?.isExternal
  let link;
  if (isExternal == "true") {
    link = req.body?.link
  } else {
    link = req.files?.link
  }

  try {
    const checkImportantLink = await ImportantLinks.findById(id)
    if (!checkImportantLink) {
      return res.status(404).json({ success: false, message: "Important Links/Documents not found" });
    }
    if (title) checkImportantLink.title = title
    if (donwloadable) checkImportantLink.donwloadable = donwloadable
    if (isExternal) checkImportantLink.isExternal = isExternal

    if (isExternal == "true") {
      checkImportantLink.link = link;
    } else {
      if (link) {
        const oldImage = checkImportantLink.link
        const docName = await UploadImage(link, "importantLink")
        checkImportantLink.link = docName
        if (oldImage) {
          await deleteImgFromFolder(oldImage, "importantLink")
        }
      }
    }

    const updatedImportantLink = await checkImportantLink.save()
    return res.status(200).json({ success: true, data: updatedImportantLink, message: "Important Links/Documents Updated", });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


const Delete = async (req, res) => {
  try {

    const checkImportantLink = await ImportantLinks.findById(req.params.id)
    if (!checkImportantLink) {
      return res.status(404).json({ success: false, message: "Important Links/Documents not found" });
    }
    if (checkImportantLink.link) {
      await deleteImgFromFolder(oldImage, "importantLink")
    }


    const response = await ImportantLinks.findByIdAndDelete(req.params.id);
    if (response) {
      res.status(200).json({ success: true, message: "Imporant Links/Documents deleted" });
    } else {
      res.status(404).json({ success: false, message: "Imporant Links/Documents not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  Create,
  getAll,
  Update,
  Delete,
  getSingle
};
