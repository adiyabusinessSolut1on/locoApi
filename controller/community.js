const Community = require("../model/Community")
const Comment = require("../model/Comment")
const Media = require("../model/Media");
const User = require("../model/user");
const { UploadImage } = require("../utils/imageUpload")
const { deleteImgFromFolder } = require("../utils/removeImages");
const { sendNotifcationToAllUsers } = require("./notification");
const { sendMessage } = require("../services/notification");


// Function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


exports.getUserCommunity = async (req, res) => {
    const id = req.params?.id
    try {
        const checkUser = await User.findById(id)
        if (!checkUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const result = await Community.find({ userId: id }).populate("media").populate({ path: "userId", select: "name email image" })
        if (!result) {
            return res.status(404).json({ success: false, message: "Community not found." });
        }
        return res.status(200).json({ msg: 'Ok', success: true, data: result })

    } catch (error) {
        console.log("error on getUserCommunity: ", error);
        return res.status(500).json({ message: error.message, error: error, success: false });
    }
}


exports.getCommunityByIdAndAll = async (req, res) => {
    const id = req.params?.id
    try {
        if (id) {
            const result = await Community.findById(id).populate("media").populate("userId", "name").populate({ path: "likes", select: "name image email mobile following followers" })
                .populate({
                    path: "comments",
                    select: "-__v",
                    populate: [
                        {
                            path: "replies",
                            populate: [
                                { path: "userId", select: "name image email mobile" },
                                {
                                    path: "replies", // Populate child replies recursively
                                    populate: { path: "userId", select: "name image email mobile" }
                                }
                            ]
                        },
                        { path: "userId", select: "name image" }
                    ]
                }).populate({ path: "userId", select: "name image email mobile" });
            if (result) {
                return res.status(200).json({ success: true, data: result });
            }
            return res.status(404).json({ success: false, message: "Community not found." });
        }
        const result = await Community.find().populate("userId", "name", "image")
        if (result) {
            return res.status(200).json({ success: true, data: result });
        }
        return res.status(404).json({ success: false, message: "Community not found." });
    } catch (error) {
        console.log("error on getCommunity: ", error);
        return res.status(500).json({ message: error.message, error: error, success: false });
    }
}

exports.getAllCommunity = async (req, res) => {
    const userId = req.userId;
    // const { limit = 5 } = req.query;
    const limit = req.query?.limit || 10
    try {

        // fetching user which is being followed
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Forbidden Access!', success: false });
        }

        // Fetch posts from followed users
        const followingPosts = await Community.find({ user: { $in: user?.following } }).sort({ createdAt: -1 }).populate({ path: "media", select: "-communityId -userId -__v" })
            .populate({
                path: "comments",
                options: { sort: { createdAt: -1 } }, // Sort comments by creation date
                select: "-__v",
                populate: [
                    {
                        path: "replies",
                        populate: [
                            { path: "userId", select: "name image email mobile" },
                            {
                                path: "replies", // Populate child replies recursively
                                populate: { path: "userId", select: "name image email mobile" }
                            }
                        ],
                        options: { sort: { createdAt: -1 } }, // Sort comments by creation date
                    },
                    { path: "userId", select: "name image" }
                ]
            }).populate({ path: "userId", select: "name image email mobile" });


        // Fetch posts from other users
        // const otherPosts = await Community.find({ user: { $nin: [...user.following, userId] } }).sort({ createdAt: -1 }).populate({ path: "media", select: "-communityId -userId -__v" }).populate({ path: "comments", select: "-__v", populate: { path: "replies", populate: { path: "userId", select: "name image" } }, populate: { path: "userId", select: "name image" } }).populate({ path: "userId", select: "-otp -fcmToken -quiz -test_yourself -daily_task -notVisibleUser -following -liekdCommunity -savedCommunity -followers  -password -savePosts -likedPosts -role -isVerify -__v" })
        const otherPosts = await Community.find({ user: { $nin: [...user.following, userId] } }).sort({ createdAt: -1 }).populate({ path: "media", select: "-communityId -userId -__v" })
            .populate({
                path: "comments", select: "-__v",
                options: { sort: { createdAt: -1 } }, // Sort comments by creation date
                populate: [
                    {
                        path: "replies",
                        populate: [
                            { path: "userId", select: "name image email mobile" },
                            {
                                path: "replies", // Populate child replies recursively
                                populate: { path: "userId", select: "name image email mobile" }
                            }
                        ],
                        options: { sort: { createdAt: -1 } }, // Sort comments by creation date
                    },
                    { path: "userId", select: "name image" }
                ]
            }).populate({ path: "userId", select: "name image email mobile" });
        // const otherPosts = await Community.find({ user: { $nin: [...user.following, userId, ...user?.notVisibleUser] } }).sort({ createdAt: -1 }).limit(limit);

        // Combine and shuffle the posts
        const combinedPosts = shuffleArray([...followingPosts, ...otherPosts]);

        // Limit to the required number of posts
        // const finalPosts = combinedPosts.slice(0, limit);
        if (combinedPosts) {
            return res.status(200).json({ success: true, data: combinedPosts });
        }
        return res.status(404).json({ success: false, message: "Community not found." });
    } catch (error) {
        console.log("error on getAllCommunity: ", error);
        return res.status(500).json({ message: error.message, error: error, success: false });
    }
}

exports.getAllCommunityTesting = async (req, res) => {
    const userId = req.userId;
    // const { limit = 5 } = req.query;
    // const limit = req.query?.limit || 10
    try {

        // fetching user which is being followed
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Forbidden Access!', success: false });
        }

        // Fetch posts from followed users
        const followingPosts = await Community.find({ user: { $in: user?.following } }).sort({ createdAt: -1 }).limit(limit);

        // Fetch posts from other users
        const otherPosts = await Community.find({ user: { $nin: [...user.following, userId] } }).sort({ createdAt: -1 }).limit(limit);
        // const otherPosts = await Community.find({ user: { $nin: [...user.following, userId, ...user?.notVisibleUser] } }).sort({ createdAt: -1 }).limit(limit);

        // Combine and shuffle the posts
        const combinedPosts = shuffleArray([...followingPosts, ...otherPosts]);

        // Limit to the required number of posts
        const finalPosts = combinedPosts.slice(0, limit);
        if (finalPosts) {
            return res.status(200).json({ success: true, data: finalPosts });
        }
        return res.status(404).json({ success: false, message: "Community not found." });
    } catch (error) {
        console.log("error on getAllCommunity: ", error);
        return res.status(500).json({ message: error.message, error: error, success: false });
    }
}


exports.addCommunity = async (req, res) => {
    // console.log("============================== addCommunity ===============================");

    // console.log("req.body: ", req.body);
    // console.log("req.files: ", req.files);


    const content = req.body?.content

    const files = req.files

    let mediaIds = []

    let firstImgName

    try {
        const checkUser = await User.findById(req.userId)
        const post = new Community({ content, userId: req.userId })

        // console.log("mediaIds: ", mediaIds);

        // Handle image uploads
        /* if (files?.images) {
            const images = Array.isArray(files.images) ? files.images : [files.images];
            for (const image of images) {
                const uploaded = await UploadImage(image, 'post');
                // console.log("uploaded image: ", uploaded);
                if (image == 0) {
                    firstImgName = uploaded;
                }
                if (uploaded) {
                    const media = new Media({ name: uploaded, type: 'image', communityId: post?._id, userId: req.userId });
                    await media.save();
                    mediaIds.push(media._id);
                }
            }
        } */
        if (files?.images) {
            const images = Array.isArray(files.images) ? files.images : [files.images];
            for (let i = 0; i < images.length; i++) {
                const image = images[i];
                const uploaded = await UploadImage(image, 'post');
                if (i === 0 && uploaded) { // Check if this is the first image and it's uploaded
                    firstImgName = uploaded;
                }
                if (uploaded) {
                    const media = new Media({ name: uploaded, type: 'image', communityId: post?._id, userId: req.userId });
                    await media.save();
                    mediaIds.push(media._id);
                }
            }
            // console.log("First image name:", firstImgName); // You can log or use the first image name as needed
        }


        // Handle video uploads
        if (files?.videos) {
            const videos = Array.isArray(files.videos) ? files.videos : [files.videos];
            for (const video of videos) {
                const uploaded = await UploadImage(video, 'post-vidoe');
                // console.log("uploaded video: ", uploaded);
                if (uploaded) {
                    // const videoPath = path.join(__dirname, '..', "assets", "vidoe", uploaded)

                    const media = new Media({ name: uploaded, type: 'video', communityId: post?._id, userId: req.userId });
                    await media.save();
                    mediaIds.push(media._id);
                }
            }
        }

        post.media = mediaIds
        const result = await post.save()
        sendNotifcationToAllUsers(null, null, "community", req.userId, firstImgName, null)
        if (result) {
            return res.status(201).json({ message: "Post created successfully", success: true, data: result });
        }
        return res.status(400).json({ message: "Failed to Post community", success: false });
    } catch (error) {
        console.log("error on addCommunity: ", error);
        return res.status(500).json({ message: error.message, error: error, success: false });
    }
}


exports.updateCommunityContent = async (req, res) => {
    const { id } = req.params
    const content = req.body?.content
    try {
        if (!content) {
            return res.status(400).json({ success: false, message: "Content is required" });
        }
        const checkCommunity = await Community.findById(id)
        if (!checkCommunity) {
            return res.status(404).json({ success: false, message: "Community not found" });
        }
        checkCommunity.content = content
        const result = await checkCommunity.save()
        if (result) {
            return res.status(200).json({ message: "Community updated successfully", success: true, data: checkCommunity });
        }
    } catch (error) {
        console.log("error on updateCommunityContent: ", error);
        return res.status(500).json({ message: error.message, error: error, success: false });
    }
}

exports.updateMediaCommunity = async (req, res) => {
    const id = req.params?.id //community id
    const mediaId = req.body?.mediaId //media id to be updated
    const media = req.files?.media
    const type = req.body?.type


    try {
        const checkCommunity = await Community.findById(id)
        if (!checkCommunity) {
            return res.status(404).json({ success: false, message: "Community not found" });
        }
        const checkMedia = await Media.findById(mediaId)
        if (!checkMedia) {
            return res.status(404).json({ success: false, message: "Media not found" });
        }
        if (media) {
            if (checkMedia.type == 'image') {
                let oldImage = checkMedia.name

                if (type == 'image') {
                    const uploaded = await UploadImage(media, 'post');
                    checkMedia.name = uploaded
                }
                if (type == 'video') {
                    // for video upload
                    const uploaded = await UploadImage(media, 'post-vidoe');
                    checkMedia.name = uploaded
                }
                await deleteImgFromFolder(oldImage, "post")
            }
            if (checkMedia.type == 'video') {
                let oldVideo = checkMedia.name
                if (type == 'image') {
                    // for image upload
                    const uploaded = await UploadImage(media, 'post');
                    checkMedia.name = uploaded
                }
                if (type == 'video') {
                    const uploaded = await UploadImage(media, 'post-vidoe');
                    checkMedia.name = uploaded
                }
                await deleteImgFromFolder(oldVideo, "post-vidoe")
            }
        }
        const result = await checkMedia.save()
        if (result) {
            return res.status(200).json({ message: "Media updated successfully", success: true, data: checkMedia });
        }
        return res.status(400).json({ message: "Failed to update media", success: false });
    } catch (error) {
        console.log("error on updateMediaCommunity: ", error);
        return res.status(500).json({ message: error.message, error: error, success: false });
    }
}

exports.deleteCommunity = async (req, res) => {
    // console.log("================================ delete community ================================");

    const id = req.params?.id //community id
    const userId = req.userId



    try {
        const checkCommunity = await Community.findOne({ _id: id, userId: userId })

        if (!checkCommunity) {
            return res.status(404).json({ success: false, message: "Community not found" });
        }
        if (checkCommunity.media && checkCommunity.media.length > 0) {
            const mediaIds = checkCommunity.media.map(media => media._id)
            const mediaDocs = await Media.find({ _id: { $in: mediaIds } })
            for (const mediaDoc of mediaDocs) {
                await deleteImgFromFolder(mediaDoc.name, mediaDoc.type == 'image' ? "post" : "post-vidoe")
            }
            await Media.deleteMany({ _id: { $in: mediaIds } })
        }
        const result = await Community.findByIdAndDelete(id)
        // console.log("result: ", result);

        if (result) {
            return res.status(200).json({ message: "Community deleted successfully", success: true, data: result });
        }
        return res.status(400).json({ message: "Failed to delete community", success: false });

    } catch (error) {
        console.log("error on deleteCommunity: ", error);
        return res.status(500).json({ message: error.message, error: error, success: false });
    }
}

// save community to user ============================ save community
exports.saveCommunityToProfile = async (req, res) => {
    const id = req.params.id //community id
    const userId = req.userId // User ID making the request
    try {
        const checkCommunity = await Community.findById(id)
        if (!checkCommunity) {
            return res.status(404).json({ success: false, message: "Community not found" });
        }
        const checkUser = await User.findById(userId)
        if (!checkUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        let checkAlready = checkUser.savedCommunities.includes(id)
        if (checkAlready) {
            checkUser.savedCommunities.pull(id)
            // return res.status(400).json({ success: false, message: "Community is already saved to your profile" });
        } else {
            checkUser.savedCommunities.push(id)
        }
        await checkUser.save()
        return res.status(200).json({ message: `Community ${checkAlready ? "unsaved" : "saved"} to your profile successfully`, success: true, });
    } catch (error) {
        console.log("error on saveCommunityToProfile: ", error);
        return res.status(500).json({ message: error.message, error: error, success: false });
    }
}

// liks or unliks of community
exports.addOrRemoveLikesOnCommunity = async (req, res) => {
    const userId = req.userId; // User ID making the request
    const communityId = req.params.id; // Community ID

    try {
        if (!communityId) {
            return res.status(400).json({ success: false, message: "Community id is required" });
        }

        // Fetch community and user in parallel
        const [community, user] = await Promise.all([
            Community.findById(communityId),
            User.findById(userId),
        ]);

        if (!community) {
            return res.status(404).json({ success: false, message: "Community not found" });
        }

        const communityUser = await User.findById(community.userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Determine if user already liked the community
        const userLiked = community.likes.includes(userId);
        const communityLikedByUser = user.likedCommunities.includes(communityId);

        if (userLiked) {
            // Remove userId from community.likes and communityId from user.likedCommunities
            community.likes = community.likes.filter(id => id.toString() !== userId);
        } else {
            // Add userId to community.likes
            community.likes.push(userId);
        }

        if (communityLikedByUser) {
            // Remove communityId from user.likedCommunities
            user.likedCommunities = user.likedCommunities.filter(id => id.toString() !== communityId);
        } else {
            // Add communityId to user.likedCommunities
            user.likedCommunities.push(communityId);
        }

        // Save both updates in parallel
        await Promise.all([community.save(), user.save()]);

        await sendMessage(communityUser._id, `Your post just got a ${userLiked ? "unlike" : "like"} from ${user?.name}. ${userLiked ? "" : "Keep sharing great content!"}`, null, "community-like", communityUser?.fcmToken, userId, null, null)


        return res.status(200).json({ message: userLiked ? "Unliked successfully" : "Liked successfully", success: true, });
    } catch (error) {
        console.error("Error in addOrRemoveLikesOnCommunity:", error);
        return res.status(500).json({ message: error.message, success: false });
    }
};




exports.testingController = async (req, res) => {
    const userId = req.user?._id

    try {
        const user = await User.findById(userId)
        const communities = await Community.aggregate([
            // Lookup to get the user details for the `userId` field in Community
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails",
                },
            },
            // Unwind the userDetails array to treat it as an object
            {
                $unwind: {
                    path: "$userDetails",
                    preserveNullAndEmptyArrays: true, // Keep communities without a user
                },
            },
            // Lookup to get the logged-in user's following list
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    pipeline: [
                        { $match: { _id: loggedInUserId } },
                        { $project: { following: 1 } },
                    ],
                    as: "loggedInUser",
                },
            },
            // Unwind the loggedInUser array
            {
                $unwind: {
                    path: "$loggedInUser",
                    preserveNullAndEmptyArrays: true,
                },
            },
            // Add a `following` field based on the comparison
            {
                $addFields: {
                    following: {
                        $cond: {
                            if: {
                                $in: ["$userDetails._id", "$loggedInUser.following"],
                            },
                            then: true,
                            else: false,
                        },
                    },
                },
            },
            // Optional: Exclude `loggedInUser` from the final output if not needed
            {
                $unset: "loggedInUser",
            },
        ]);

        return res.status(200).json({ msg: 'Ok', result: communities })
    } catch (error) {
        console.error("Error in testingController:", error);
        return res.status(500).json({ message: error.message, success: false });
    }
}