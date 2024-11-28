const Setting = require("../../model/Setting");



exports.getAppSetting = async (req, res) => {
    const id = req.params.id
    try {
        if (id) {
            const result = await Setting.findById(id)
            if (result) {
                return res.status(200).json({ success: true, data: result });
            }
            return res.status(404).json({ success: false, message: "App Setting not found." });
        }

        const result = await Setting.find()
        if (result) {
            return res.status(200).json({ success: true, data: result });
        }
        return res.status(404).json({ success: false, message: "App Setting not found." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
exports.addSetting = async (req, res) => {
    const id = req.params?.id


    const versionCode = req.body.versionCode
    const appName = req.body?.appName
    const versionName = req.body.versionName
    const comment = req.body?.comment
    const url = req.body.url


    try {

        if (id) {
            const checkSetting = await Setting.findById(id)
            if (!checkSetting) {
                return res.status(404).json({ success: false, message: "App Setting not found. Please add one" });
            }
            const result = await Setting.findByIdAndUpdate(id, { versionCode, versionName, comment, url, appName }, { new: true })
            if (result) {
                return res.status(200).json({ success: true, data: result, message: "App Setting updated successfully." });
            }
            return res.status(400).json({ success: false, message: "Failed to update app setting!" });
        } else {
            const result = await Setting.create({ versionCode, versionName, comment, url, appName })
            if (result) {
                return res.status(201).json({ success: true, data: result, message: "App Setting updated successfully." });
            }
            return res.status(400).json({ success: false, message: "Failed to update app setting!" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


exports.deleteAppSetting = async (req, res) => {
    const id = req.params.id
    try {
        const checkSetting = await Setting.findById(id)
        if (!checkSetting) {
            return res.status(404).json({ success: false, message: "App Setting not found. Please add one" });
        }
        const result = await Setting.findByIdAndDelete(id)
        if (result) {
            return res.status(200).json({ success: true, message: "App Setting deleted successfully." });
        }
        return res.status(400).json({ success: false, message: "Failed to delete app setting!" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}