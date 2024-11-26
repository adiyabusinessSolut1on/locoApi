const { Server } = require("socket.io");
const http = require("http")
const express = require("express")


const app = express()

const server = http.createServer(app)
const io = new Server(server, { cors: { origin: '*', } })

exports.getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId]
}

const userSocketMap = {} // {userId: socketId}
// console.log("userSocketMap: ", userSocketMap);

io.on('connection', (socket) => {

    const userId = socket.handshake.query?.userId

    if (userId !== "undefined") {
        userSocketMap[userId] = socket.id
    }

    // io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUser", Object.keys(userSocketMap))


    socket.on('disconnect', () => {
        delete userSocketMap[userId]
        io.emit("getOnlineUser", Object.keys(userSocketMap))
    })
})


module.exports = { app, io, server }