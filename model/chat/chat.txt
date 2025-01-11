const mongoose = require('mongoose');

const ChatSchema=new mongoose.Schema({
    members:Array,
},
{
    timestamps:true,
})
const chatModel=mongoose.model("chats",ChatSchema);
module.exports = chatModel;