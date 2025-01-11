const mongoose = require("mongoose");


const QuizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required:true
    },
    category:{
      type:String
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
        ref: "quiz_question",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Quiz = mongoose.model("quiz", QuizSchema);
module.exports = Quiz;
