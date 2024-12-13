const path = require('path');


exports.UploadImage = async (image, type) => {
    // console.log("image: ", image);
    // console.log("type: ", type);

    const date = new Date();
    const imageName = type + date.getTime() + image.name.replace(/\s+/g, '')
    if (type === 'post') {
        const imagePath = path.join(__dirname, '..', "assets", "image", imageName)
        image.mv(imagePath, (err) => {
            if (err) {
                console.log("error on image: ", err);

                return false
            }
        })
    }

    if (type === 'post-vidoe') {
        const imagePath = path.join(__dirname, '..', "assets", "vidoe", imageName)
        image.mv(imagePath, (err) => {
            if (err) {
                console.log("error on video: ", err);
                return false
            }
        })
    }

    return imageName
}