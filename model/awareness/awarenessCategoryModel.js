const mongoose = require("mongoose");

const awarenessCategoryModel = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    image:{
      type:String,
    }
  }
);

const AwarenessCategory = mongoose.model("awarenesscategory", awarenessCategoryModel);
module.exports = AwarenessCategory;
