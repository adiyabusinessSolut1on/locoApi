const path = require('path')
const fs = require('fs')

// Delete image from folder when deleting driver
exports.deleteImgFromFolder = async (fileName, type) => {
    // console.log("================================================ deleteImgFromFolder ==================================================");

    let removeprofileFilePath;
    console.log("fileName: ", fileName);


    if (!fileName) {
        return false
    }

    if (type === 'post') {
        removeprofileFilePath = path.join(__dirname, '..', "assets", "image", fileName)
    }
    if (type === 'post-vidoe') {
        removeprofileFilePath = path.join(__dirname, '..', "assets", "vidoe", fileName)
    }

    // console.log("removeProfileFilePath: ", removeprofileFilePath);
    fs.unlink(removeprofileFilePath, (err) => {
        if (err) {
            console.log("removeprofileFilePath: ", err);
            return false
        } else {
            return true
        }
    })
}