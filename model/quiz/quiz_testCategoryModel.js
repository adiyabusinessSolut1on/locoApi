const mongoose = require("mongoose");

const QuizTestCategoryModel = new mongoose.Schema({
  name: {
    type: String,
  },
  image: {
    type: String,
  }
}
);

const QuizTestCategory = mongoose.model("quiz_test_category", QuizTestCategoryModel);
module.exports = QuizTestCategory;
