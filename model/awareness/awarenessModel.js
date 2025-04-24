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
      type: String,
      require: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Awareness = mongoose.model("awareness", awarenessModel);
module.exports = Awareness;
