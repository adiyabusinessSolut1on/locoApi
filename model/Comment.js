const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    communityUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    communityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'community'
    },
    comment: {
        type: String,
        required: true
    },
    commentType: {
        type: String,
        default: 'comment',
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, { timestamps: true });
const Comment = mongoose.model('Comment', CommentSchema)

module.exports = Comment;