const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    read: {
        type: Boolean,
        default: false
    },
    notifyId: {
        // type: mongoose.Schema.Types.ObjectId,
        type: String,
    },
    notificationType: {
        type: String,
        // enum: ['message', 'post', 'comment', 'like', 'follow', 'test_yourself_question', 'blog', 'test', 'post comment', 'post like', 'report', 'awareness', 'mutual', 'general', 'image', 'community', 'community-follow', 'post like', 'post comment']
    },
    image: {
        type: String,
        default: null
    },
    readAt: {
        type: String
    },
    isRead: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })


const Notification = mongoose.model('notification', NotificationSchema)

module.exports = Notification