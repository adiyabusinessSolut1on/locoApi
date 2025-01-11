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
    userTasks: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to User model
        status: {
          type: String,
          enum: ["pending", "completed"],
          default: "pending", // Default status
        },
        completionDate: {
          type: Date,
        },
        taskType: {
          type: String,
          enum: ["post", "blog", "video", "quiz", "test", "awareness", "test_yourself"], // Available task types
        }
      },
    ],
  }, { timestamps: true, }
);

const DailyTask = mongoose.model("dailytask", DailyTadkModelSchema);
module.exports = DailyTask;
