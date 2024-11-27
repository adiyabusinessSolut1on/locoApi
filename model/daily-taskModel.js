const mongoose = require("mongoose");



const DailyTadkModelSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required:true
    },
    content: {
      type: String,
      required:true
    }, 
  },
  {
    timestamps: true,
  }
);

const DailyTask = mongoose.model("dailytask", DailyTadkModelSchema);
module.exports = DailyTask;
