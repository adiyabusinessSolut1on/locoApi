const mongoose = require("mongoose");


const TestYourSelfSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    category: {
      type: String
    },
    score: {
      type: Number,
    },
    rightanswers: {
      type: Number,
    },
    wronganswers: {
      type: Number,
    },
    instructions: {
      type: String,
    },
    isComplete: {
      type: Boolean,
      default: false,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "test_yourself_question",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const TestYourSelf = mongoose.model("test_yourself", TestYourSelfSchema);
module.exports = TestYourSelf;
