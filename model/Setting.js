const mongoose = require('mongoose')


const SettingSchema = new mongoose.Schema({
    versionCode: {
        type: Number
    },
    versionName: {
        type: Number
    },
    comment: {
        type: String
    },
    url: {
        type: String
    },
    appName: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true })

const Setting = mongoose.model('setting', SettingSchema)
module.exports = Setting