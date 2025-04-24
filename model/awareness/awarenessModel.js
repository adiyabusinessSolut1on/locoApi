const mongoose = require("mongoose");

const awarenessModel = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "awarenesscategory"
    },
    description: {
      type: String,
    },
  },
  { timestamps: true, }
);

const Awareness = mongoose.model("awareness", awarenessModel);
module.exports = Awareness;
