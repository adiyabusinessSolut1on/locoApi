const Suggestion = require("../model/Suggestion");

exports.getAllSuggestion = async (req, res) => {
    const id = req.params?.id
    try {
        const page = parseInt(req.query.page) || 1;  // default to page 1
        const limit = parseInt(req.query.limit) || 10; // default to 10 items per page
        const skip = (page - 1) * limit;

        if (id) {
            const result = await Suggestion.findById(id).populate("user", "_id name email mobile designation division image");
            return res.status(200).json({ success: true, data: result });
        }
        const total = await Suggestion.countDocuments();
        const suggestions = await Suggestion.find().populate("user", "_id name email mobile designation division image").sort({ createdAt: -1 }).skip(skip).limit(limit);

        return res.status(200).json({ success: true, data: suggestions, pagination: { total, page, limit, totalPages: Math.ceil(total / limit), }, });
    } catch (error) {
        console.error("Error in getAllSuggestion:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.getSingleUserSeggestions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;  // default to page 1
        const limit = parseInt(req.query.limit) || 10; // default to 10 items per page
        const skip = (page - 1) * limit;

        const total = await Suggestion.countDocuments({ user: req.userId });
        const suggestions = await Suggestion.find({ user: req.userId }).sort({ createdAt: -1 }).skip(skip).limit(limit);
        const user = await User.findById(req.userId);

        if (suggestions) {
            return res.status(200).json({ success: true, data: suggestions, pagination: { total, page, limit, totalPages: Math.ceil(total / limit), }, user });
        }
        return res.status(404).json({ success: false, message: "Suggestion not found" });
    } catch (error) {
        console.error("Error in getSingleUserSeggestions:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}


exports.addSuggestion = async (req, res) => {
    const suggestion = req.body?.suggestion
    const description = req.body?.description
    try {
        const result = new Suggestion({ user: req.userId, suggestion, description });
        const savedSuggestion = await result.save();
        return res.status(201).json({ success: true, data: savedSuggestion, message: "Suggestion added successfully" });
    } catch (error) {
        console.log("error on addSuggestion: ", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

exports.deleteSuggestion = async (req, res) => {
    const id = req.params?.id
    try {
        const result = await Suggestion.findByIdAndDelete(id);
        if (result) {
            return res.status(200).json({ success: true, message: "Suggestion deleted successfully" });
        }
        return res.status(400).json({ success: false, message: "Failed to delete suggestion" });
    } catch (error) {
        console.log("error on deleteSuggestion: ", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}