const path = require('path')
const fs = require('fs')

// Delete image from folder when deleting driver
exports.deleteImgFromFolder = async (fileName, type) => {
    // console.log("================================================ deleteImgFromFolder ==================================================");

    let removeprofileFilePath;
    // console.log("fileName: ", fileName);


    if (!fileName) {
        return false
    }

    if (type === 'post') {
        removeprofileFilePath = path.join(__dirname, '..', "assets", "image", fileName)
    }
    if (type === 'post-vidoe') {
        removeprofileFilePath = path.join(__dirname, '..', "assets", "vidoe", fileName)
    }

    if (type === 'profile') {
        removeprofileFilePath = path.join(__dirname, '..', "assets", "profile", fileName)
    }

    if (type === 'notification') {
        removeprofileFilePath = path.join(__dirname, '..', "assets", "notification", fileName)
    }

    if (type === 'blog') {
        removeprofileFilePath = path.join(__dirname, '..', "assets", "blog", fileName)
    }

    if (type === 'blogCategory') {
        removeprofileFilePath = path.join(__dirname, '..', "assets", "blogCategory", fileName)
    }

    if (type === 'awareness') {
        removeprofileFilePath = path.join(__dirname, '..', "assets", "awareness", fileName)
    }

    if (type === 'awarenessCategory') {
        removeprofileFilePath = path.join(__dirname, '..', "assets", "awarenessCategory", fileName)
    }

    if (type === 'importantLink') {
        removeprofileFilePath = path.join(__dirname, '..', "assets", "importantLink", fileName)
    }
    if (type === 'uploadThumbnail') {
        removeprofileFilePath = path.join(__dirname, '..', "assets", "uploadThumbnail", fileName)
    }
    if (type === 'uploadVideo') {
        removeprofileFilePath = path.join(__dirname, '..', "assets", "uploadVideo", fileName)
    }
    if (type === 'userProfile') {
        removeprofileFilePath = path.join(__dirname, '..', "assets", "userProfile", fileName)
    }
    if (type === 'sponsorVideo') {
        removeprofileFilePath = path.join(__dirname, '..', "assets", "sponsorVideo", fileName)
    }
    if (type === 'sponsorImage') {
        removeprofileFilePath = path.join(__dirname, '..', "assets", "sponsorImage", fileName)
    }
    if (type === 'quizCategory') {
        removeprofileFilePath = path.join(__dirname, '..', "assets", "quizCategory", fileName)
    }
    if (type === 'quizQuestions') {
        removeprofileFilePath = path.join(__dirname, '..', "assets", "quizQuestions", fileName)
    }
    if (type === 'testYourSelf') {
        removeprofileFilePath = path.join(__dirname, '..', "assets", "testYourSelf", fileName)
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