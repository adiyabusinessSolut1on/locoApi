const express = require("express");
const router = express.Router();
const { isAdmin } = require("../../middleware/rolebaseuserValidate");
const { createCategory, getAllCategory, UpdateCategory, deleteCategory, CreateAwareNess, getAllAwareness, getAwarenessById, getAwarenessByCategory, UpdateAwareness, deleteAwareness } = require("../../controller/admin/awaremessController");

// Awareness Category
router.post("/awareness/category/create", isAdmin, createCategory);
router.put("/awareness/category/:id", isAdmin, UpdateCategory);
router.get("/awareness/category", isAdmin, getAllCategory);
router.delete("/awareness/category/:id", isAdmin, deleteCategory);

//Awareness
router.post("/awareness/create", isAdmin, CreateAwareNess);
router.get("/awareness", isAdmin, getAllAwareness);
router.get("/awareness/:id", isAdmin, getAwarenessById);
router.get("/awareness_category/:category", isAdmin, getAwarenessByCategory); // all Awareness By Category
router.put("/awareness/:id", isAdmin, UpdateAwareness);
router.delete("/awareness/:id", isAdmin, deleteAwareness);


module.exports = router;