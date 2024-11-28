const Pusher = require("../../config/pusher");

const NotificationPush = async (req, res) => {
  const { blogId, title, message } = req.body;
  try {
    Pusher.trigger('blog-channel', 'new-blog', { blogId, title, message, });
    res.status(200).json({ success: true, message: 'Notification sent!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { NotificationPush };