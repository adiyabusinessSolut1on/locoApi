const express = require("express");
const { isUser } = require("../middleware/rolebaseuserValidate");
const { addSuggestion, getSingleUserSeggestions, deleteSuggestion, getAllSuggestion } = require("../controller/suggestion");
const suggestionRouter = express.Router();

suggestionRouter.get('/', getAllSuggestion)
suggestionRouter.get('/single/:id', getAllSuggestion)

suggestionRouter.get('/user/suggestion/:id', isUser, getSingleUserSeggestions)

suggestionRouter.post("/add/suggestion", isUser, addSuggestion);

suggestionRouter.delete('/detele/suggestion/:id', isUser, deleteSuggestion)


module.exports = suggestionRouter