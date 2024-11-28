const admin = require('firebase-admin')
const serviceAccount = require('../notification-firebase-adminsdk.json')
const Notification = require('../model/Notification')
const User = require('../model/user')
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})


exports.sendMessage = async (reciver, title, description, type, fcmToken, sender, image) => {
    // console.log("=============== sendMessage ============");
    // console.log("sender: ", sender, "reciver: ", reciver, "title: ", title, " description: ", description, " type: ", type, "fcmToken: ", fcmToken);

    // console.log("fcmToken: ", fcmToken);
    const messageC = {
        notification: {
            title: title,
            body: description,
            image: image ? image : '',
        },
        data: {
            type: type
        },
        token: fcmToken
    }
    try {
        if (!fcmToken) {
            return "User not login yet once!"
        }

        const checkAdmin = await User.findOne({ role: "admin" })

        const result = await Notification.create({ title: title, description: description, senderId: sender ? sender : checkAdmin?._id, recipient: reciver, notificationType: type ? type : 'notify' })
        if (result) {
            admin.messaging().send(messageC).then(async (response) => {
                console.log("response admin.messaging: ", response);
            }).catch((err) => {
                console.log("err: error on sending message", err);
                return err
            })
        } else {
            return 'Failed to creaet notificatoin in table!'
        }
    } catch (error) {
        console.log("error on sendMessage: ", error);
        return error.message
    }
}