const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const comment=new mongoose.Schema({
  comment:{
      type:String,
  },
  comment_user:{
      type: mongoose.Schema.Types.ObjectId,
          ref: "user",
  }
});

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
    like: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    }],
    comments: [comment],
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
