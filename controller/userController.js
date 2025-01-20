const bcrypt = require("bcrypt");
require("dotenv").config();
const User = require("../model/user");
const Post = require("../model/post");
const Mutual = require("../model/mutual");
const jwt = require("jsonwebtoken");
const TestYourSelf = require("../model/test_yourself/text_yourself");
const TestYourSelfQuestion = require("../model/test_yourself/testYourSelfQuestionModel");
const Quiz = require("../model/quiz/quizModel");
const QuizQuestion = require("../model/quiz/quizquestions");
const { sendNotifcationToAllUsers } = require("./notification");
const { sendMessage } = require("../services/notification");
const Notification = require("../model/Notification");
const Poll = require("../model/pollModel");
const Report = require("../model/report");
const Media = require("../model/Media");
const { UploadImage } = require("../utils/imageUpload");
const path = require('path');
const { deleteImgFromFolder } = require("../utils/removeImages");
const Community = require("../model/Community");

const UserRegister = async (req, res) => {
  const { image, name, email, mobile, password } = req.body;

  // console.log("req.body: ", req.body);
  try {
    if (mobile.toString().length !== 10) {
      return res.status(400).json({ success: false, message: "Invalid Mobile Number", });
    }
    if (!/^\d{10}$/.test(mobile.toString())) {
      return res.status(400).json({ success: false, message: "Invalid Mobile Number" });
    }
    const user = await User.findOne({ $or: [{ email: email }, { mobile: mobile }] });
    // console.log("user: ", user);

    if (user) {
      return res.status(400).json({ success: false, message: "User already exists! Please check mobile number of email id", });
    }

    // console.log("user: ", user);


    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ image: image, name: name, email: email, mobile: mobile, password: hashPassword, });

    await newUser.save();

    res.status(201).json({ success: true, message: "User register successfully", data: newUser, });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, });
  }
};


const UserLogin = async (req, res) => {
  const { email, password, fcmToken } = req.body;

  try {
    const user = await User.findOne({ email: email });
    // console.log("user: ", user);

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid Email credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    // console.log("isMatch: ", isMatch);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid Password credentials" });
    }
    const token = jwt.sign({ _id: user._id, email: user?.email, role: user?.role }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRE_TIME, });
    // console.log("token: ", token);

    if (fcmToken) {
      user.fcmToken = fcmToken;
      await user.save();
    }

    return res.cookie("authorization", token, { httpOnly: true, expires: new Date(Date.now() + 240 * 60 * 60 * 1000), }).status(200).json({ success: true, message: "Login successful", token: token, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password, -savePosts, -likedPosts").select("-otp").select("-password");
    const postCount = await Community.countDocuments({ userId: req.userId });
    if (!user) {
      return res.status(403).json({ success: false, message: "user Not Found" });
    }
    return res.status(200).json({ success: true, data: user, postCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, });
  }
};

// getting user info by id
const userInfo = async (req, res) => {
  const id = req.params.id
  try {
    if (!id) {
      return res.status(400).json({ success: false, message: "Please provide a valid ID" });
    }
    const result = await User.findById(id).select("-otp -password -quiz -test_yourself -daily_task -fcmToken -role -isVerify")
    let follower = result.followers.length
    let following = result.following.length
    let likedCommunities = result.likedCommunities.length
    const postCount = await Community.countDocuments({ userId: id });
    if (result) {
      return res.status(200).json({ success: true, data: result, following, follower, likedCommunities, postCount });
    }
    return res.status(404).json({ success: false, message: "User Not Found" });
  } catch (error) {
    console.log("error on userInfo: ", error);
    return res.status(500).json({ success: false, message: error.message, error });
  }
}
// following api for the user to follow other user ==================================== following api
const followOtherUser = async (req, res) => {
  const id = req.params?.id //other user id
  const userId = req.userId //current user id

  try {
    const checkOtherUser = await User.findById(id)

    if (!checkOtherUser) {
      return res.status(404).json({ success: false, message: "User Not Found" });
    }
    const checkCurrentUser = await User.findById(userId)

    if (!checkCurrentUser) {
      return res.status(404).json({ success: false, message: "user not found" })
    }

    let checkFollowing = checkCurrentUser.following.includes(id)
    if (checkCurrentUser.following.includes(id)) {
      // return res.status(400).json({ success: false, message: "Already following this user" });
      checkCurrentUser.following.pull(id)
    } else {
      checkCurrentUser.following.push(id)
    }

    if (checkOtherUser.followers.includes(userId)) {
      checkOtherUser.followers.pull(userId)
    } else {
      checkOtherUser.followers.push(userId)
    }

    await checkCurrentUser.save()
    await checkOtherUser.save()
    await sendMessage(checkOtherUser._id, `${checkFollowing ? "" : "Congratulations! "} ${checkCurrentUser?.name} is now ${checkFollowing ? "unfollowing" : "following"} you.`, null, "community-follow", checkOtherUser?.fcmToken, userId, null, null)

    return res.status(200).json({ success: false, message: checkOtherUser.followers.includes(userId) ? "followed successfully" : "unfollowed successfully" });
  } catch (error) {
    console.log("error on followOtherUser: ", error);
    return res.status(500).json({ success: false, message: error.message, error });
  }
}

// bloking user by id ============================= lock user
const blockAndUnblockUser = async (req, res) => {
  const userId = req.userId; // ID of the current user
  const blockUserId = req.params.id; // ID of the user to block

  // console.log("======================================= blockUserPost ================================ ")
  // console.log("req.params: ", req.params)
  // console.log("req.userId: ", req.userId)
  try {
    // Ensure the user to block exists
    const blockUserExists = await User.findById(blockUserId);
    if (!blockUserExists) {
      return res.status(404).json({ message: "User to block not found", success: false });
    }

    // Find the current user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(403).json({ message: "Unauthorized access!", success: false });
    }

    // Check if the user is already blocked
    const alreadyBlocked = user.notVisibleUser.includes(blockUserId);
    if (alreadyBlocked) {
      checkCurrentUser.notVisibleUser.pull(id)
      // return res.status(200).json({ message: "User already blocked", success: true });
    }

    // Add the user to the blocked list
    user.notVisibleUser.push(blockUserId);
    await user.save();

    return res.status(200).json({ message: `User successfully ${alreadyBlocked ? "unblocked" : "blocked"}`, success: true });
  } catch (error) {
    console.error("Error blocking user:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
}

const getAllFollwingUser = async (req, res) => {
  const userId = req.userId
  try {
    const checkUser = await User.findById(userId);
    if (!checkUser) {
      return res.status(404).json({ success: false, message: "User Not Found" });
    }
    const followingUsers = await User.find({ _id: { $in: checkUser.following } }).select("-password -savePosts -likedPosts -otp -password -quiz -test_yourself -daily_task -fcmToken -role -isVerify");
    if (!followingUsers) {
      return res.status(404).json({ success: false, message: "No following users found" });
    }
    return res.status(200).json({ success: true, data: followingUsers });
  } catch (error) {
    console.error("Error getAllFollwingUser user:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
}

const getAllFollowerUser = async (req, res) => {
  const userId = req.userId
  try {
    const checkUser = await User.findById(userId);
    if (!checkUser) {
      return res.status(404).json({ success: false, message: "User Not Found" });
    }
    const followingUsers = await User.find({ _id: { $in: checkUser.followers } }).select("-password -savePosts -likedPosts -otp -password -quiz -test_yourself -daily_task -fcmToken -role -isVerify");
    if (!followingUsers) {
      return res.status(404).json({ success: false, message: "No followers users found" });
    }
    return res.status(200).json({ success: true, data: followingUsers });
  } catch (error) {
    console.error("Error getAllFollowerUser user:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
}

const blockedUser = async (req, res) => {
  const userId = req.userId

  try {
    const checkUser = await User.findById(userId);
    if (!checkUser) {
      return res.status(404).json({ success: false, message: "User Not Found" });
    }
    const followingUsers = await User.find({ _id: { $in: checkUser.notVisibleUser } }).select("-password -savePosts -likedPosts -otp -password -quiz -test_yourself -daily_task -fcmToken -role -isVerify");
    if (!followingUsers) {
      return res.status(404).json({ success: false, message: "No followers users found" });
    }
    return res.status(200).json({ success: true, data: followingUsers });
  } catch (error) {
    console.error("Error blockedUser user:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
}

const UserForgotPassword = async (req, res) => {
  const mobile = req.body?.mobile
  const password = req.body?.password
  try {
    const checkUser = await User.findOne({ mobile: mobile })
    if (!checkUser) {
      return res.status(404).json({ success: false, message: "User Not Found" });
    }
    // sending otp function
    // const otp = Math.floor(1000 + Math.random() * 9000);
    checkUser.otp = '1234';
    const hashPassword = await bcrypt.hash(password, 10);
    checkUser.password = hashPassword
    checkUser.save()

    const message = `Your OTP is ${otp}.`;
    // sendMessage(checkUser.mobile, message);
    return res.status(200).json({ success: true, message: "OTP sent successfully" });


    // return res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, });
  }
}


const verifyOtp = async (req, res) => {
  const mobile = req.body?.mobile
  const otp = req.body?.otp
  try {
    const checkUser = await User.findOne({ mobile: mobile })
    if (!checkUser) {
      return res.status(404).json({ success: false, message: "User Not Found" });
    }
    if (checkUser.otp !== otp) {
      return res.status(401).json({ success: false, message: "Invalid OTP" });
    }
    return res.status(200).json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, });
  }
}


const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Post.findByIdAndDelete(id);
    // const images = await Media.findById(response?.images)
    if (response.images && response.images.length > 0) {
      for (const imageId of response.images) {
        const image = await Media.findById(imageId);
        if (image) {
          await deleteImgFromFolder(image.name, "post"); // Delete image from folder
          await Media.findByIdAndDelete(imageId); // Delete image document from Media
        }
      }
    }

    // Step 3: Delete videos from the Media collection and storage folder
    if (response.videos && response.videos.length > 0) {
      for (const videoId of response.videos) {
        const video = await Media.findById(videoId);
        if (video) {
          await deleteImgFromFolder(video.name, "post-video"); // Delete video from folder
          await Media.findByIdAndDelete(videoId); // Delete video document from Media
        }
      }
    }
    if (!response) {
      return res.status(404).json({ success: false, message: "Data Not Found" });
    }
    res.status(200).json({ success: true, message: " post Delete", });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, });
  }
};


const UpdatePost = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Post.findByIdAndUpdate(id, req.body, { new: true, });
    if (!response) {
      return res.status(404).json({ success: false, message: "Data Not Found" });
    }
    res.status(200).json({ success: true, message: "Post Updated", data: response, });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const UpdateImagePost = async (req, res) => {
  const { id } = req.params; //this is post id
  const image = req.files.image
  const imageId = req.body.imageId
  // const type = req.body.type
  try {
    const checkPost = await Post.findById(id)
    if (!checkPost) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }
    const checkImage = await Media.findById(imageId)
    if (!checkImage) {
      return res.status(404).json({ success: false, message: "Image not found" });
    }
    let type = checkImage.type
    if (image) {
      if (checkImage) {
        await deleteImgFromFolder(checkImage.name, type == 'image' ? "post" : "post-vidoe")
      }
      const uploaded = await UploadImage(image, type == 'image' ? "post" : "post-vidoe");
      const imagePath = path.join(__dirname, '..', "assets", type, uploaded)
      checkImage.name = uploaded
      checkImage.path = imagePath
    }
    await checkImage.save()
    return res.status(200).json({ message: 'Image updated successfully.', success: true })
  } catch (error) {
    return res.status(500).json({ success: false, message: err.message, });
  }
}


const deleteImagePost = async (req, res) => {
  const id = req.params?.id; // This is the post ID
  const imageId = req.body.imageId; // This is the image ID

  try {
    // Step 1: Check if the post exists
    const checkPost = await Post.findById(id);
    if (!checkPost) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // Step 2: Check if the image exists
    const checkImage = await Media.findById(imageId);
    if (!checkImage) {
      return res.status(404).json({ success: false, message: "Image not found" });
    }

    // Step 3: Delete the image from storage folder
    let type = checkImage.type; // Assuming 'type' tells if it's an image or video
    await deleteImgFromFolder(checkImage.name, type === 'image' ? "post" : "post-video");

    // Step 4: Remove the image ID from the images array in Post
    if (type == 'image') {
      await Post.findByIdAndUpdate(
        id,
        { $pull: { images: imageId } }, // Remove the imageId from the images array
        { new: true } // Return the updated document
      );
    }
    if (type == 'video') {
      await Post.findByIdAndUpdate(
        id,
        { $pull: { videos: imageId } }, // Remove the imageId from the images array
        { new: true } // Return the updated document
      );
    }

    // Step 5: Remove the image document from the Media collection
    // await checkImage.remove();
    await Media.findByIdAndDelete(imageId);

    // Step 6: Return success response
    return res.status(200).json({ message: 'Image deleted successfully and removed from post.', success: true });

  } catch (error) {
    console.error("Error deleting image post:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


const userPost = async (req, res) => {
  // need to handle image and video uploading with array images and videos
  const content = req.body?.content;
  const files = req.files
  // const images = req.files?.images
  // const videos = req.files?.videos

  const imageIds = [];
  const videoIds = [];

  let notifyImages = []
  try {

    if (files?.images) {
      const images = Array.isArray(files.images) ? files.images : [files.images];
      for (const image of images) {
        const uploaded = await UploadImage(image, 'post');
        // console.log("uploaded image: ", uploaded);

        if (uploaded) {
          const imagePath = path.join(__dirname, '..', "assets", "image", uploaded)
          // console.log("imagePath: ", imagePath);

          notifyImages.push(imagePath)
          const media = new Media({ name: uploaded, type: 'image', path: imagePath });
          await media.save();
          imageIds.push(media._id);
        }
      }
    }

    // Handle video uploads
    if (files?.videos) {
      const videos = Array.isArray(files.videos) ? files.videos : [files.videos];
      for (const video of videos) {
        const uploaded = await UploadImage(video, 'post-vidoe');
        // console.log("uploaded video: ", uploaded);
        if (uploaded) {
          const videoPath = path.join(__dirname, '..', "assets", "vidoe", uploaded)
          // console.log("videoPath: ", videoPath);

          const media = new Media({ name: uploaded, type: 'video', path: videoPath });
          await media.save();
          videoIds.push(media._id);
        }
      }
    }

    const newPost = new Post({ user: req.userId, content: content, images: imageIds, videos: videoIds, });
    const result = await newPost.save();

    if (result) {
      await sendNotifcationToAllUsers("One New Post Created Recently", content, "post", req.userId, notifyImages.length > 0 ? notifyImages[0] : null, newPost?._id)
      return res.status(201).json({ success: true, message: "post created successfully", data: result, });
    }
    return res.status(400).json({ success: false, message: "failed to upload the post", })

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, });
  }
};

const getAllPost = async (req, res) => {
  try {
    const response = await Post.find().populate({ path: "user", select: "-password -otp", }).populate({ path: "comments.comment_user", select: "-password -otp", }).populate({ path: "images", }).populate({ path: "videos", })

    if (!response.length > 0) {
      return res.status(404).json({ success: false, message: "Data Not Found" });
    }
    res.status(200).json({ success: true, message: "get post Successfully", data: response, });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, });
  }
};

const getAllPostByUserId = async (req, res) => {
  const userId = req.userId;
  try {
    const response = await Post.find({ user: userId }).populate({ path: "user", select: "-password -otp", }).populate({ path: "comments.comment_user", select: "-password -otp", }).populate({ path: "images", }).populate({ path: "videos", });
    if (!response.length > 0) {
      return res.status(404).json({ success: false, message: "Data Not Found" });
    }
    res.status(200).json({ success: true, message: "get post Successfully", data: response, });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, });
  }
};


const getSinglePost = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Post.findById(id).populate({ path: "images", }).populate({ path: "videos", }).populate({ path: "user", select: "_id name image email", }).populate({ path: "comments.comment_user", select: "_id name image email", });
    if (!response) {
      return res.status(404).json({ success: false, message: "Data Not Found" });
    }
    res.status(200).json({ success: true, message: "get post Successfully", data: response, });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, });
  }
};


const DeleteMutualPost = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Mutual.findByIdAndDelete(id);
    if (!response) {
      return res.status(404).json({ success: false, message: "Data Not Found" });
    }
    res.status(200).json({ success: true, message: " Mutual post Delete", });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, });
  }
};


const UpdateMutualPost = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Mutual.findByIdAndUpdate(id, req.body, { new: true, });
    if (!response) {
      return res.status(404).json({ success: false, message: "Data Not Found" });
    }
    res.status(200).json({ success: true, message: "get post Updated", data: response, });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, });
  }
};

const userMutualPost = async (req, res) => {
  const { name, email, mobile, currentdivision, designation, currentlobby, wantedlobby, wanteddivision, } = req.body;
  try {

    const newMutual = new Mutual({ userId: req.userId, name: name, email: email, mobile: mobile, currentdivision: currentdivision, designation: designation, currentlobby: currentlobby, wantedlobby: wantedlobby, wanteddivision: wanteddivision, });
    await newMutual.save();
    res.status(201).json({ success: true, message: "post created successfully", data: newMutual, });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, });
  }
};

const getAllFormPost = async (req, res) => {
  try {
    // const response = await Mutual.find().populate('userId');
    const response = await Mutual.find().populate('userId', '-password -quiz -savePosts -test_yourself -fcmToken -isVerify -likedPosts -daily_task'); // Exclude specific fields

    if (!response.length > 0) {
      return res.status(404).json({ success: false, message: "Data Not Found" });
    }
    res.status(200).json({ success: true, message: "get post Successfully", data: response, });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, });
  }
};

const LikePosts = async (req, res) => {
  const userId = req.userId;
  try {
    const { id } = req.params;

    const updatedUser = await User.findByIdAndUpdate(userId, { $push: { likedPosts: id } }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const post = await Post.findByIdAndUpdate(id, { $inc: { like: 1 } }, { new: true })

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const checkUser = await User.findById(post?.user)

    if (checkUser) {
      await sendMessage(post?.user, post?.thumnail, post?.content, "post like", checkUser?.fcmToken, req?.userId)
    }

    res.status(200).json({ success: true, message: "Post liked successfully", data: post, });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, });
  }
};

const userLikedPosts = async (req, res) => {
  const userId = req.userId;
  try {
    const response = await User.findById(userId).populate("likedPosts");
    if (!response) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: response?.likedPosts, });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, });
  }
};

const SavePosts = async (req, res) => {
  const userId = req.userId;
  try {
    const response = await User.findById(userId).populate("savePosts");
    if (!response) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: response?.savePosts, });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, });
  }
};

const unLikePosts = async (req, res) => {
  const userId = req.userId;
  try {
    const { id } = req.params;

    const updatedUser = await User.findByIdAndUpdate(userId, { $pull: { likedPosts: id } }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const post = await Post.findByIdAndUpdate(id, { $inc: { like: -1 } }, { new: true });

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    res.status(200).json({ success: true, message: "Post Un-liked successfully", data: post, });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, });
  }
};

const CommentPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const userId = req.userId;
    const post = await Post.findById(id).populate({ path: "images", }).populate({ path: "videos", });

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const newComment = { comment: comment, comment_user: userId };
    post.comments.push(newComment);
    await post.save();

    const checkUser = await User.findById(post?.user)

    if (checkUser) {
      await sendMessage(post?.user, post?.thumnail, post?.content, "post comment", checkUser?.fcmToken, req?.userId)
    }

    res.status(200).json({ success: true, message: "Comment added successfully", data: post, });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, });
  }
};


const getAllFormPostByUserId = async (req, res) => {
  const userId = req.userId;
  try {
    const response = await Mutual.find({ userId: userId }).populate('userId');

    if (!response.length > 0) {
      return res.status(404).json({ success: false, message: "Data Not Found" });
    }
    res.status(200).json({ success: true, message: "get post Successfully", data: response, });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, });
  }
};

const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const getSeachMutualpostUsingDvision = async (req, res) => {
  const { search } = req.query;
  try {
    if (!search || search.trim() === "") {
      return res.send({ success: false, message: "Search query cannot be empty", });
    }
    const escapedSearch = escapeRegex(search);
    const searchRegex = new RegExp(`^${escapedSearch}`, "i");
    const response = await Mutual.find({ $or: [{ currentdivision: searchRegex }], }).populate('userId');

    if (!response.length > 0) {
      return res.status(404).json({ success: false, message: "Data Not Found" });
    }
    res.status(200).json({ success: true, message: "get post Successfully", data: response, });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, });
  }
};

const getSeachMutualpostUsingwantedLobby = async (req, res) => {
  const { search } = req.query;
  try {
    if (!search || search.trim() === "") {
      return res.send({ success: false, message: "Search query cannot be empty", });
    }
    const escapedSearch = escapeRegex(search);
    const searchRegex = new RegExp(`^${escapedSearch}`, "i");
    const response = await Mutual.find({ $or: [{ currentlobby: searchRegex }], }).populate('userId');

    if (!response.length > 0) {
      return res.status(404).json({ success: false, message: "Data Not Found" });
    }
    res.status(200).json({ success: true, message: "get post Successfully", data: response, });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, });
  }
};


const UpdateUserProfile = async (req, res) => {

  // console.log("profile update: ", req.files)
  // console.log("profile body: ", req.body)
  const id = req.userId;
  const data = req.body;
  const profile = req.files?.profile

  try {

    const checkuser = await User.findById(id)
    if (!checkuser) {
      return res.status(404).send({ message: "User not found" });
    }

    if (checkuser.image) {
      await deleteImgFromFolder(checkuser.image, "profile");
    }

    if (profile) {
      const uploaded = await UploadImage(profile, 'profile');
      data.image = uploaded;
    }

    const updatedUser = await User.findByIdAndUpdate(id, { $set: data }, { new: true }).select("-password");

    /* if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    } */

    res.status(202).send({ success: true, message: "user Updated", data: updatedUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, });
  }
};


const savePostInUser = async (req, res) => {
  const id = req.userId;

  try {
    const { postId } = req.body;

    const updatedUser = await User.findByIdAndUpdate(id, { $push: { savePosts: postId } }, { new: true }).populate("savePosts");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "Saved post updated successfully", data: updatedUser, });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, });
  }
};

const removePostFromUser = async (req, res) => {
  const id = req.userId;
  try {
    const { postId } = req.body;

    const updatedUser = await User.findByIdAndUpdate(id, { $pull: { savePosts: postId } }, { new: true }).populate("savePosts");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "Post removed successfully", data: updatedUser, });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, });
  }
};

const getAllQuiz = async (req, res) => {
  try {
    const response = await Quiz.find().populate("questions");
    if (!response?.length > 0) {
      return res.status(200).json({ success: false, mesaage: "Quiz Not Found" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSingleQuiz = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Quiz.findById(id).populate("questions");
    if (!response) {
      return res.status(200).json({ success: false, mesaage: "Quiz Not Found" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllTest = async (req, res) => {
  try {
    const response = await TestYourSelf.find().populate("questions");
    if (!response?.length > 0) {
      return res.status(200).json({ success: false, mesaage: "Test Not Found" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSingleTest = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await TestYourSelf.findById(id).populate("questions");
    if (!response) {
      return res.status(200).json({ success: false, mesaage: "Test Not Found" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const UpdateAnswer = async (req, res) => {
  const { id } = req.params;
  const { answer } = req.body;
  try {
    const question = await QuizQuestion.findById(id);

    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    question.actualresult = answer;
    question.isTrue = answer === question.predicted_result;

    await question.save();

    res.status(200).json({ success: true, data: question, message: "Answer submitted successfully", });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, });
  }
};


const QuizComplete = async (req, res) => {
  const { id } = req.params;
  try {
    const quiz = await Quiz.findById(id).populate("questions");
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }
    const answeredQuestions = quiz?.questions.filter((q) => q.isTrue !== undefined);
    const rightAnswers = answeredQuestions.filter((q) => q.isTrue).length;
    const wrongAnswers = answeredQuestions.length - rightAnswers;
    const score = (rightAnswers / quiz.questions.length) * 100;
    const updatedQuiz = await Quiz.findByIdAndUpdate(id, { rightanswers: rightAnswers, wronganswers: wrongAnswers, score: score, isComplete: true, }, { new: true });

    res.status(200).json({ success: true, message: "Quiz results updated successfully", data: updatedQuiz, });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, });
  }
};


const UpdateTestAnswer = async (req, res) => {
  const { id } = req.params;
  const { answer } = req.body;
  try {
    const question = await TestYourSelfQuestion.findById(id);

    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    question.actualresult = answer;
    question.isTrue = answer === question.predicted_result;

    await question.save();

    res.status(200).json({ success: true, data: question, message: "Answer submitted successfully", });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, });
  }
};


const TestComplete = async (req, res) => {
  const { id } = req.params;
  try {
    const quiz = await TestYourSelf.findById(id).populate("questions");
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Test not found" });
    }
    const answeredQuestions = quiz?.questions.filter((q) => q.isTrue !== undefined);
    const rightAnswers = answeredQuestions.filter((q) => q.isTrue).length;
    const wrongAnswers = answeredQuestions.length - rightAnswers;
    const score = (rightAnswers / quiz.questions.length) * 100;
    const resp = await TestYourSelf.findByIdAndUpdate(
      id,
      {
        rightanswers: rightAnswers,
        wronganswers: wrongAnswers,
        score: score,
        isComplete: true,
      },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Test results updated successfully", data: resp, });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, });
  }
};


const userComplteteQuiz = async (req, res) => {
  const id = req.userId;
  try {
    const response = await User.findById(id);
    if (!response) {
      return res.status(404).json({ success: false, message: "user not found" });
    }
    response.quiz.push(req.body);

    await response.save();
    res.status(200).json({ success: true, message: "Quiz data added to user successfully", data: response, });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, });
  }
};


const userComplteteTest = async (req, res) => {
  const id = req.userId;
  try {
    const response = await User.findById(id);
    if (!response) {
      return res.status(403).json({ success: false, message: "user not found" });
    }
    response.test_yourself.push(req.body);

    await response.save();
    res.status(200).json({ success: true, message: "Test data added to user successfully", data: response, });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, });
  }
};

// my chnages
const deleteUserAccount = async (req, res) => {
  const id = req.params.id
  // console.log("id: ", id);

  try {
    const checkUser = await User.findById(id)
    if (!checkUser) {
      return res.status(404).json({ success: false, message: "User not found", });
    }

    const checkMutual = await Mutual.deleteMany({ userId: id })
    // console.log("checkMutual", checkMutual);

    const checkNotification = await Notification.deleteMany({ $or: [{ senderId: id }, { recipient: id }], });
    // console.log("checkNotification", checkNotification);

    const deletedPolls = await Poll.deleteMany({ userId: id });
    // console.log("deletedPolls", deletedPolls);

    // Step 2: Remove the user from the `voters` array in all polls
    // const updatedPolls = await Poll.updateMany(
    //   { "options.voters": id },
    //   { $pull: { "options.$[].voters": id } } // Remove userId from voters in all options
    // );
    // console.log("updatedPolls", updatedPolls);

    const checkPost = await Post.deleteMany({ user: id })
    // console.log("checkPost", checkPost);
    const checkReport = await Report.deleteMany({ $or: [{ reportedBy: id }, { reportedUser: id }] })
    // console.log("checkReport", checkReport);


    const result = await User.findByIdAndDelete(id)
    if (result) {
      return res.status(200).json({ success: true, message: `User ${result?.name} deleted successfully.`, data: result, })
    }
    return res.status(400).json({ success: false, message: "Failed to delte user", });

  } catch (error) {
    console.log("error on deleting user: ", error);

    res.status(500).json({ success: false, message: error.message, });
  }
}

module.exports = {
  getUser,
  UserRegister,
  UserLogin,
  userPost,
  getAllPost,
  getAllPostByUserId,
  userMutualPost,
  getAllFormPost,
  getAllFormPostByUserId,
  getSeachMutualpostUsingDvision,
  getSeachMutualpostUsingwantedLobby,
  UpdateUserProfile,
  LikePosts,
  CommentPost,
  savePostInUser,
  getAllQuiz,
  getSingleQuiz,
  getAllTest,
  getSingleTest,
  UpdateAnswer,
  QuizComplete,
  UpdateTestAnswer,
  TestComplete,
  userComplteteQuiz,
  userComplteteTest,
  removePostFromUser,
  UpdateMutualPost,
  DeleteMutualPost,
  UpdatePost,
  deletePost,
  unLikePosts,
  SavePosts,
  userLikedPosts,
  getSinglePost,
  deleteUserAccount,
  UpdateImagePost,
  deleteImagePost,
  UserForgotPassword,
  verifyOtp,
  userInfo,
  followOtherUser,
  blockAndUnblockUser,
  getAllFollwingUser,
  getAllFollowerUser,
  blockedUser,
};
