const Notification = require("../model/Notification");
const User = require("../model/user")
const { sendMessage } = require("../services/notification")


exports.getNotificationById = async (req, res) => {
    // console.log("req.params: ", req.params);

    const id = req.params.id
    try {
        if (!id) {
            return res.status(403).json({ success: false, message: "Access denied." });
        }
        const result = await Notification.find({ recipient: id })
        // console.log("result: ", result);

        if (result) {
            return res.status(200).json({ success: true, data: result });
        }
        return res.status(404).json({ success: false, message: "Notification not found." });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false, })
    }
}




exports.sendNotifcationToAllUsers = async (title, description, type, senderId, image) => {


    try {
        const users = await User.find()

        if (users.length > 0) {
            users.forEach(async (user) => {
                await sendMessage(user._id, title, description, type, user?.fcmToken, senderId, image)
            })
        }
        // sendMessage(sender, reciver, title, content, "blog")
    } catch (error) {
        return error.message
    }
}

exports.sendMututalNotification = async (title, description, type, senderId, division) => {
    try {
        const users = await User.find({ $or: [{ designation: division },], });
        if (users?.length > 0) {
            users.forEach(async (user) => {
                await sendMessage(user._id, title, description, type, user?.fcmToken, senderId)
            })
        }
    } catch (error) {
        return error.message
    }
}

exports.testNotification = async (req, res) => {
    const userId = req.body.id
    try {
        const checkUser = await User.findById(userId)
        if (checkUser) {

            /* const messageC = {
                notification: {
                    title: "title",
                    body: "description",
                },
                data: {
                    type: "type"
                },
                token: "eZm3tz46T6GSyExmZrh1iT:APA91bFXeWIP39j6KvO5izJB4WynjL1EAzTKzoCM917YYIdyR2j3oRjmKfqJdYgP3G3HEyXM1SuM-mNrILGG_fpc0d6tqv788NVlcuvYE7yWSM3io9edi7g"
            }

            admin.messaging().send(messageC).then(async (response) => {
                console.log("response admin.messaging: ", response);
            }).catch((err) => {
                console.log("err: error on sending message", err);
                return err
            }) */
            // (reciver, title, description, type, fcmToken, sender)   eZm3tz46T6GSyExmZrh1iT:APA91bFXeWIP39j6KvO5izJB4WynjL1EAzTKzoCM917YYIdyR2j3oRjmKfqJdYgP3G3HEyXM1SuM-mNrILGG_fpc0d6tqv788NVlcuvYE7yWSM3io9edi7g
            sendMessage(checkUser?._id, "test title", "test description", "test", checkUser?.fcmToken,)
            return res.status(200).json({ message: "test notification sent to user", success: true })
        }
        return res.status(404).json({ message: "User not found", success: false })
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false, })
    }
}