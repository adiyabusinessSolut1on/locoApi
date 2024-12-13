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
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    },
    path: {
        type: String
    }
}, { timestamps: true })

const Media = mongoose.model('Media', MediaSchema)
module.exports = Media