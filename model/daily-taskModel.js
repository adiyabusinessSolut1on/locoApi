const mongoose = require("mongoose");



const DailyTadkModelSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    awareness: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "awareness"
      }
    ],
    blog: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "blog"
      }
    ],
    video: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "video"
      }
    ],
    quiz: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "quiz"
      }
    ],
    test: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "test_yourself"
      }
    ],
    type: {
      type: String,
      enum: ['awareness', 'blog', 'video', 'quiz', 'test'],
      default: 'awareness',
      required: true,  // Add required: true for the type field.
    }
  },
  { timestamps: true, }
);

const DailyTask = mongoose.model("dailytask", DailyTadkModelSchema);
module.exports = DailyTask;
