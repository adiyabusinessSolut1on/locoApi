const mongoose = require("mongoose");

const mutualPostrModel = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user'
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number
    },
    currentdivision: {
      type: String
    },
    designation: {
      type: String
    },
    currentlobby: {
      type: String
    },
    wantedlobby: {
      type: String
    },
    wanteddivision: {
      type: String
    },
  }, { timestamps: true }
);

const Mutual = mongoose.model("mutual", mutualPostrModel);
module.exports = Mutual;
