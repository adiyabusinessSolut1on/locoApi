const path = require('path');
const fs = require('fs');


exports.UploadImage = async (image, type) => {
    // console.log("image: ", image);
    // console.log("type: ", type);
    const checkDir = path.join(__dirname, '..', "assets", "image")
    const checkImagedir = path.dirname(checkDir);
    if (!fs.existsSync(checkImagedir)) {
        fs.mkdirSync(checkImagedir, { recursive: true }); // Create the directory (and parent directories if necessary)
    }

    const vidoePath = path.join(__dirname, '..', "assets", "vidoe")
    const checkVideodir = path.dirname(vidoePath);
    if (!fs.existsSync(checkVideodir)) {
        fs.mkdirSync(checkVideodir, { recursive: true }); // Create the directory (and parent directories if necessary)
    }

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

/* const path = require('path');
const fs = require('fs');

exports.UploadImage = async (image, type) => {
    console.log("image: ", image);
    console.log("type: ", type);
    try {
        const baseDir = path.join(__dirname, '..', 'assets');
        const imageDir = path.join(baseDir, 'image');
        const videoDir = path.join(baseDir, 'vidoe');

        // Ensure directories exist
        if (!fs.existsSync(imageDir)) {
            fs.mkdirSync(imageDir, { recursive: true });
        }
        if (!fs.existsSync(videoDir)) {
            fs.mkdirSync(videoDir, { recursive: true });
        }

        // Generate a unique filename
        const date = new Date();
        const sanitizedFileName = image.name.replace(/\s+/g, '');
        const fileName = `${type}-${date.getTime()}-${sanitizedFileName}`;

        console.log("filename: ", fileName);

        let targetDir;
        if (type === 'post') {
            targetDir = imageDir;
        } else if (type === 'post-video') {
            targetDir = videoDir;
        } else {
            throw new Error(`Invalid type: ${type}`);
        }

        const filePath = path.join(targetDir, fileName);
        console.log("filePath: ", filePath);


        // Move the file
        await new Promise((resolve, reject) => {
            image.mv(filePath, (err) => {
                if (err) {
                    console.error(`Error moving file: ${err.message}`);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        console.log("fileName: ", fileName);

        return fileName;
    } catch (err) {
        console.error(`UploadImage error: ${err.message}`);
        throw err;
    }
}; */
