const mongoose = require("mongoose");

const sponSorProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    link: {
      type: String,
      required: true,
    },
    sponsorname: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const SponsorProduct = mongoose.model("sponsorproduct", sponSorProductSchema);
module.exports = SponsorProduct;
