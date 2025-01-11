const mongoose = require('mongoose');

const CommunitySchema = new mongoose.Schema({
    header: {
        type: String,
    },
    title: {
        type: String,
    },
    content: {
        type: String,
    },
    media: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Media",
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }
}, { timestamps: true })


const Community = mongoose.model('community', CommunitySchema);

module.exports = Community;