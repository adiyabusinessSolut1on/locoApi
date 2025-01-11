const Pusher = require("../../config/pusher");
const Awareness = require("../../model/awareness/awarenessModel");
const Blog = require("../../model/blogs/blogModules");
const { UploadImage } = require("../../utils/imageUpload");
const { sendNotifcationToAllUsers } = require("../notification");

const NotificationPush = async (req, res) => {
  // console.log("req.body: ", req.body);
  // console.log("req.files: ", req.files);

  const message = req.body?.message
  const awarenessId = req.body?.awarenessId
  const blogId = req.body?.blogId
  const title = req.body?.title
  const image = req.files?.image

  try {
    // return res.status(400).json({ message: "filed", success: false });
    Pusher.trigger('blog-channel', 'new-blog', { blogId, title, message, });
    if (blogId) {
      const checkBlog = await Blog.findById(blogId);
      if (!checkBlog) {
        return res.status(404).json({ success: false, message: 'Blog not found' });
      }

      await sendNotifcationToAllUsers(title, message, "blog", req.userId, checkBlog?.thumnail, checkBlog?._id)
      return res.status(200).json({ success: true, message: 'Notification sent!' });
    }

    if (awarenessId) {
      const checkAwareness = await Awareness.findById(awarenessId?._id);
      if (!checkAwareness) {
        return res.status(404).json({ success: false, message: 'Awareness not found' });
      }
      await sendNotifcationToAllUsers(awarenessId?.name, message, "awareness", req.userId, checkAwareness?.image, awarenessId?._id)
      return res.status(200).json({ success: true, message: 'Notification sent!' });
    }
    if (title && !blogId && !image && !awarenessId) {
      await sendNotifcationToAllUsers(title, message, "general", req.userId, null)
      return res.status(200).json({ success: true, message: 'Notification sent!' });
    }

    if (image && title) {
      const imageUrl = await UploadImage(image, 'notification');
      await sendNotifcationToAllUsers(title, message, "image", req.userId, imageUrl)
      return res.status(200).json({ success: true, message: 'Notification sent!' });
    }
    // return res.status(400).json({ success: true, message: 'Ok' })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { NotificationPush };