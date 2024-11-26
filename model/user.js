const mongoose = require("mongoose");

const userQuiz = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "quiz" },

  score: {
    type: Number,
  },
  rightanswers: {
    type: Number,
  },
  wronganswers: {
    type: Number,
  },
  isComplete: {
    type: Boolean,
    default: false,
  },
});
const userTask = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "dailytask" },
  isComplete: { type: Boolean }
})

/* const userDailyTask = new mongoose.Schema({
  dailyTaskId: [userTask],
  isComplete: { type: Boolean }
}, { timestamps: true }); */

const userTest = new mongoose.Schema({
  testId: { type: mongoose.Schema.Types.ObjectId, ref: "test_yourself" },

  score: {
    type: Number,
  },
  rightanswers: {
    type: Number,
  },
  wronganswers: {
    type: Number,
  },
  isComplete: {
    type: Boolean,
    default: false,
  },
});

const userModel = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    image: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: { type: Number },
    password: {
      type: String,
    },
    isVerify: {
      type: Boolean,
      default: false,
    },
    division: {
      type: String,
    },
    designation: {
      type: String,
    },
    otp: {
      type: Number,
    },
    savePosts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    }],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    fcmToken: {
      type: String,
      // unique: true,
    },
    quiz: [userQuiz],
    test_yourself: [userTest],
    daily_task: [userTask]
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("user", userModel);
module.exports = User;
