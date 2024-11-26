import { getReceiverSocketId, io } from "../soket/socket.js";
import Conversation from "../model/chat/conversation.model.js"
import Message from "../model/chat/message.model.js"

export const getMessage = async (req, res,) => {
    const { id: userToChatId } = req.params; //it is receiverId
    const senderId = req.user?._id;

    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES


        /* const conversation = await Conversation.find({
            participants: { $all: [senderId, userToChatId] },
        }).populate("messages")

        if (!conversation) {
            return res.status(404).json({ message: "No conversation found" });
        }
        return res.status(200).json({ result: conversation, success: true }); */
        if (!conversation) {
            return res.status(404).json({ message: "No conversation found", result: [] });
        }
        return res.status(200).json({ result: conversation, success: true });
    } catch (error) {
        console.log("error on sendMessage: ", error);
        return res.status(500).json({ message: error.message, error: error, success: false });
    }
}

export const sendMessage = async (req, res) => {
    // console.log("req.params: ", req.params);
    // console.log("req.body: ", req.body);
    // console.log("erq.user: ", req.user);


    const { id: receiverId } = req.params; //it is receiverId
    const senderId = req.user?._id;
    const message = req.body.message;


    try {
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        })
        if (!conversation) {
            conversation = await Conversation.create({ participants: [senderId, receiverId] })
        }
        const newMessage = new Message({ senderId, receiverId, message });

        if (newMessage) {
            conversation.messages.push(newMessage?._id);
        }
        // await conversation.save();
        // await newMessage.save();
        await Promise.all([conversation.save(), newMessage.save()]);

        const receiverSocketId = getReceiverSocketId(receiverId)
        if (receiverSocketId) {
            // io.to(<socket_id>).emit() used to send events to specifice client
            io.to(receiverSocketId).emit('newMessage', newMessage);  // emitting to the receiver's socket
        }

        return res.status(200).json({ result: newMessage, success: true });
    } catch (error) {
        console.log("error on sendMessage: ", error);
        return res.status(500).json({ message: error.message, error: error, success: false });
    }
}