const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    options: [
      {
        type: String,
        required: true
      },
    ],

    predicted_result: {
      type: String,
      required: true
    },
    actualresult: {
      type: String,
    },
    isTrue: {
      type: Boolean,
    },
    answer_description: {
      type: String,
    },
  }, { timestamps: true, }
);

const Question = mongoose.model("quiz_question", questionSchema);
module.exports = Question;
