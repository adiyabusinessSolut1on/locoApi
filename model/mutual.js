const mongoose = require("mongoose");

const mutualPostrModel = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: { type: Number },
    currentdivision: { type: String },
    designation: { type: String },
    currentlobby: { type: String },
    wantedlobby:{type:String},
    wanteddivision:{type:String},
  },
  { timestamps: true }
);

const Mutual = mongoose.model("mutual", mutualPostrModel);
module.exports = Mutual;
