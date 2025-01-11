const mongoose = require('mongoose');
const MediaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['image', 'video', 'audio'],
        default: 'image'
    },
    communityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'community'
    },
    path: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
}, { timestamps: true })

const Media = mongoose.model('Media', MediaSchema)
module.exports = Media