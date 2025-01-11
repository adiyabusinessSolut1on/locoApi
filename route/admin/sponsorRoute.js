const express = require("express");
const router = express.Router();
const { isAdmin } = require("../../middleware/rolebaseuserValidate");

const { createcompany, getAllcompany, UpdateCompany, deleteCompany, createProduct, getAllProsucts, getSingleProduct, UpdateProduct, deleteProduct, getSinglecompany } = require("../../controller/admin/sponsorController")

//Sponsor Company
router.post("/sponsor/company", isAdmin, createcompany);
router.get("/sponsor/company", isAdmin, getAllcompany);
router.put("/sponsor/company/:id", isAdmin, UpdateCompany);
router.delete("/sponsor/company/:id", isAdmin, deleteCompany);
router.get("/sponsor/company/:id", isAdmin, getSinglecompany);

//Sponsor Product
router.post("/sponsor/product", isAdmin, createProduct);
router.get("/sponsor/product", isAdmin, getAllProsucts);
router.get("/sponsor/product/:id", isAdmin, getSingleProduct);
router.put("/sponsor/product/:id", isAdmin, UpdateProduct);
router.delete("/sponsor/product/:id", isAdmin, deleteProduct);


module.exports = router;
