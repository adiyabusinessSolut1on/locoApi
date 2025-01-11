const mongoose = require("mongoose");

const ImportantLinks = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    link: {
      type: String,
      required: true,
    },
    donwloadable: {
      type: Boolean,
      enum: [false, true],
      default: false,
    },
    isExternal: {
      type: Boolean,
      default: false,
    }
  }, { timestamps: true, }
);

const ImpLinks = mongoose.model("importantlinks", ImportantLinks);
module.exports = ImpLinks;
