const mongoose = require('mongoose');
const BannerSchema = new mongoose.Schema({
    title: {
        type: String,
        // required: true
    },
    image: {
        type: String,
        // required: true
    },
    link: {
        type: String,
        // required: true
    },
    position: {
        type: String,
        // required: true, enum: ['Top', 'Bottom']
    },
    status: {
        type: String,
        // required: true, enum: ['Active', 'Inactive']
    },
    priority: {
        type: Number,
        // required: true
    }
}, { timestamps: true })

const Banner = mongoose.model('Banner', BannerSchema);
module.exports = Banner;