const ImportantLinks=require("../../model/implinksModel")
const Create = async (req, res) => {
    try {
      const response = new ImportantLinks(req.body);
      const saveresponse = await response.save();
      res.status(201).json({
        success: true,
        data: saveresponse,
        message: "Important Link/Document Created",
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
  const getAll = async (req, res) => {
    try {
      const response = await ImportantLinks.find();
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  const getSingle = async (req, res) => {
    const {id}=req.params
    try {
      const response = await ImportantLinks.findById(id);
      if (!response) {
        return res
          .status(200)
          .json({ success: false, mesaage: "Important Links/Document Not Found" });
      }
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  const Update= async (req, res) => {
    try {
      const response = await ImportantLinks.findByIdAndUpdate(
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
          message: "Imporant Links/Documents Updated",
        });
      } else {
       return res.status(404).json({ success: false, message: "Imporant Links/Documents not found" });
      }
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
  const Delete = async (req, res) => {
    try {
      const response = await ImportantLinks.findByIdAndDelete(req.params.id);
      if (response) {
        res
          .status(200)
          .json({ success: true, message: "Imporant Links/Documents deleted" });
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
  