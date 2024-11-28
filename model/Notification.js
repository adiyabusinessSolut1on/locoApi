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
    notificationType: {
        type: String,
        enum: ['message', 'post', 'comment', 'like', 'follow', 'test_yourself_question', 'blog', 'test', 'post comment', 'post like', 'report', 'awareness', 'mutual']
    }
}, { timestamps: true })


const Notification = mongoose.model('notification', NotificationSchema)

module.exports = Notification