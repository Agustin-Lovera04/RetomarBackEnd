import mongoose, { mongo } from "mongoose";

export const chatModel = new mongoose.model('chats', new mongoose.Schema({
    user: {type: String, unique: true, required: true},
    message: []
},
{
    timestamps:true
}))