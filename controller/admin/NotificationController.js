const Pusher = require("../../config/pusher");
const Blog = require("../../model/blogs/blogModules");
const { sendNotifcationToAllUsers } = require("../notification");

const NotificationPush = async (req, res) => {
  const { blogId, title, message } = req.body;
  try {
    Pusher.trigger('blog-channel', 'new-blog', { blogId, title, message, });

    const checkBlog = await Blog.findById(blogId);
    if (!checkBlog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    await sendNotifcationToAllUsers(title, message, "blog", req.userId, checkBlog?.thumnail)
    res.status(200).json({ success: true, message: 'Notification sent!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { NotificationPush };