const mongoose = require("mongoose");

const SuggestionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    suggestion: {
        type: String,
    },
    description: {
        type: String
    }
}, { timestamps: true });

const Suggestion = mongoose.model("suggestion", SuggestionSchema);

module.exports = Suggestion