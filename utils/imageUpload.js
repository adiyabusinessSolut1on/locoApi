const path = require('path');
const fs = require('fs');


exports.UploadImage = async (image, type) => {
    // console.log("image: ", image);
    // console.log("type: ", type);
    const imageDir = path.join(__dirname, '..', "assets", "image");
    const videoDir = path.join(__dirname, '..', "assets", "video");
    const profileDir = path.join(__dirname, '..', "assets", "profile");
    const notificationDir = path.join(__dirname, '..', "assets", "notification");
    const blogDir = path.join(__dirname, '..', "assets", "blog");
    const blogCategoryDir = path.join(__dirname, '..', "assets", "blogCategory");
    const awarenessDir = path.join(__dirname, '..', "assets", "awareness");
    const awarenessCategoryDir = path.join(__dirname, '..', "assets", "awarenessCategory");
    const importantLinkDir = path.join(__dirname, '..', "assets", "importantLink");
    const uploadThumbnailDir = path.join(__dirname, '..', "assets", "uploadThumbnail");
    const uploadVideoDir = path.join(__dirname, '..', "assets", "uploadVideo");
    const userProfileDir = path.join(__dirname, '..', "assets", "userProfile");
    const sponsorVideoDir = path.join(__dirname, '..', "assets", "sponsorVideo");
    const sponsorImageDir = path.join(__dirname, '..', "assets", "sponsorImage");
    const quizCategoryDir = path.join(__dirname, '..', "assets", "quizCategory");
    const quizQuestionsDir = path.join(__dirname, '..', "assets", "quizQuestions");
    const testYourSelfDir = path.join(__dirname, '..', "assets", "testYourSelf");
    const bannerDir = path.join(__dirname, '..', "assets", "banner");

    // Function to create a directory if it doesn't exist
    function ensureDirectoryExists(dirPath) {

        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            // console.log(`Directory created: ${dirPath}`);
        } else {
            // console.log(`Directory already exists: ${dirPath}`);
        }
    }

    // Ensure 'assets/image' directory exists
    ensureDirectoryExists(imageDir);

    // Ensure 'assets/video' directory exists
    ensureDirectoryExists(videoDir);

    ensureDirectoryExists(profileDir);

    ensureDirectoryExists(notificationDir);
    ensureDirectoryExists(blogDir);
    ensureDirectoryExists(blogCategoryDir);
    ensureDirectoryExists(blogCategoryDir);
    ensureDirectoryExists(awarenessDir);
    ensureDirectoryExists(awarenessCategoryDir);
    ensureDirectoryExists(importantLinkDir);
    ensureDirectoryExists(uploadThumbnailDir);
    ensureDirectoryExists(uploadVideoDir);
    ensureDirectoryExists(userProfileDir);
    ensureDirectoryExists(sponsorVideoDir);
    ensureDirectoryExists(sponsorImageDir);
    ensureDirectoryExists(quizCategoryDir);
    ensureDirectoryExists(quizQuestionsDir);
    ensureDirectoryExists(testYourSelfDir);
    ensureDirectoryExists(bannerDir);

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

    // profile
    if (type === 'profile') {
        const imagePath = path.join(__dirname, '..', "assets", "profile", imageName)
        image.mv(imagePath, (err) => {
            if (err) {
                console.log("error on profile image: ", err);
                return false
            }
        })

    }

    // notification
    if (type === 'notification') {
        const imagePath = path.join(__dirname, '..', "assets", "notification", imageName)
        image.mv(imagePath, (err) => {
            if (err) {
                console.log("error on notification image: ", err);
                return false
            }
        })
    }

    // notification
    if (type === 'notification') {
        const imagePath = path.join(__dirname, '..', "assets", "notification", imageName)
        image.mv(imagePath, (err) => {
            if (err) {
                console.log("error on notification image: ", err);
                return false
            }
        })
    }

    // blog
    if (type === 'blog') {
        const imagePath = path.join(__dirname, '..', "assets", "blog", imageName)
        image.mv(imagePath, (err) => {
            if (err) {
                console.log("error on image: ", err);
                return false
            }
        })
    }

    // post-vidoe
    if (type === 'post-vidoe') {
        const imagePath = path.join(__dirname, '..', "assets", "video", imageName)
        image.mv(imagePath, (err) => {
            if (err) {
                console.log("error on video: ", err);
                return false
            }
        })
    }

    // blogCategoryDir
    if (type === 'blogCategory') {
        const imagePath = path.join(__dirname, '..', "assets", "blogCategory", imageName)
        image.mv(imagePath, (err) => {
            if (err) {
                console.log("error on image: ", err);
                return false
            }
        })
    }


    // awareness
    if (type === 'awareness') {
        const imagePath = path.join(__dirname, '..', "assets", "awareness", imageName)
        image.mv(imagePath, (err) => {
            if (err) {
                console.log("error on image: ", err);
                return false
            }
        })
    }


    // awarenessCategory
    if (type === 'awarenessCategory') {
        const imagePath = path.join(__dirname, '..', "assets", "awarenessCategory", imageName)
        image.mv(imagePath, (err) => {
            if (err) {
                console.log("error on image: ", err);
                return false
            }
        })
    }

    // importantLink
    if (type === 'importantLink') {
        const imagePath = path.join(__dirname, '..', "assets", "importantLink", imageName)
        image.mv(imagePath, (err) => {
            if (err) {
                console.log("error on image: ", err);
                return false
            }
        })
    }

    // uploadThumbnail
    if (type === 'uploadThumbnail') {
        const imagePath = path.join(__dirname, '..', "assets", "uploadThumbnail", imageName)
        image.mv(imagePath, (err) => {
            if (err) {
                console.log("error on image: ", err);
                return false
            }
        })
    }


    // uploadVideo
    if (type === 'uploadVideo') {
        const imagePath = path.join(__dirname, '..', "assets", "uploadVideo", imageName)
        image.mv(imagePath, (err) => {
            if (err) {
                console.log("error on image: ", err);
                return false
            }
        })
    }

    // userProfile
    if (type === 'userProfile') {
        const imagePath = path.join(__dirname, '..', "assets", "userProfile", imageName)
        image.mv(imagePath, (err) => {
            if (err) {
                console.log("error on image: ", err);
                return false
            }
        })
    }

    // sponsorVideo
    if (type === 'sponsorVideo') {
        const imagePath = path.join(__dirname, '..', "assets", "sponsorVideo", imageName)
        image.mv(imagePath, (err) => {
            if (err) {
                console.log("error on image: ", err);
                return false
            }
        })
    }

    // sponsorImage
    if (type === 'sponsorImage') {
        const imagePath = path.join(__dirname, '..', "assets", "sponsorImage", imageName)
        image.mv(imagePath, (err) => {
            if (err) {
                console.log("error on image: ", err);
                return false
            }
        })
    }

    // quizCategory
    if (type === 'quizCategory') {
        const imagePath = path.join(__dirname, '..', "assets", "quizCategory", imageName)
        image.mv(imagePath, (err) => {
            if (err) {
                console.log("error on image: ", err);
                return false
            }
        })
    }

    // quizQuestions
    if (type === 'quizQuestions') {
        const imagePath = path.join(__dirname, '..', "assets", "quizQuestions", imageName)
        image.mv(imagePath, (err) => {
            if (err) {
                console.log("error on image: ", err);
                return false
            }
        })
    }

    // testYourSelf
    if (type === 'testYourSelf') {
        const imagePath = path.join(__dirname, '..', "assets", "testYourSelf", imageName)
        image.mv(imagePath, (err) => {
            if (err) {
                console.log("error on image: ", err);
                return false
            }
        })
    }


    // banner
    if (type === 'banner') {
        const imagePath = path.join(__dirname, '..', "assets", "banner", imageName)
        image.mv(imagePath, (err) => {
            if (err) {
                console.log("error on image: ", err);
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
