import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from  "../lib/socket.js";

export const getUsersForSidebar = async (req,res) => {
    try{
        const loggedInUserId = req.user._id;
        // collect all users expect the logged in user
        const filteredUsers = await User.find({_id: { $ne: loggedInUserId } }).select("-password");
        
        res.status(200).json(filteredUsers);
    }catch(error){
        console.error("Error in getUserForSidebar: ", error);
        res.status(500).json({message: "Internal Server Error"});
    }
};
// get messages between users
export const getMessages = async(req,res)=>{
    try{
        const {id:userToChatId} = req.params
        const myId = req.user._id;

        const messages = await Message.find({
            $or:[
                {senderId: myId, receiverId:userToChatId},
                {senderId: userToChatId, receiverId:myId}
            ]
        })
        res.status(200).json(messages);
    }catch(error) {
         console.log("Error in getMessages controller", error.message);
         res.status(500).json({message: "Internal Server Error"})
    }
}

export const sendMessage = async (req,res)=>{
    try{
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            // upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = await Message({
            senderId,
            receiverId,
            text,
            image:imageUrl
        })
        
        await newMessage.save();

        // realtime functionality goes here => socket.io
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        res.status(200).json(newMessage);

    }catch (error){
        console.log("Error in sendMessage controller", error.message);
        res.status(500).json({message: "Internal Server Error"})
    }
}