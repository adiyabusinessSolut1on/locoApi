const mongoose = require("mongoose");

const sponsorCompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    video: {
      type: String,
    },
    description: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    isYoutube: {
      type: Boolean,
      default: false,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "sponsorproduct",
      },
    ],
  }, { timestamps: true, }
);

const SponsorCompany = mongoose.model("SponsorCompany", sponsorCompanySchema);
module.exports = SponsorCompany;
