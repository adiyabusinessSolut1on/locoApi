const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pollSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    type: {
      type: String,
      default: "poll",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    timelimit: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    options: [
      {
        percent: {
          type: Number,
        },
        optionName: {
          type: String,
          required: true,
          trim: true,
        },
        voters: [
          {
            type: Schema.Types.ObjectId,
            ref: "user",
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Poll = mongoose.model("Poll", pollSchema);

module.exports = Poll;
