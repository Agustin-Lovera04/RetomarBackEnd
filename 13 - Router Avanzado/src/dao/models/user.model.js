import mongoose from "mongoose";


export const usersModel = mongoose.model('users', new mongoose.Schema(
    {
        name: {type: String, required: true},
        email: {type: String, required: true, unique:true},
        password: {type: String},
        rol: {type: String, default: 'user'}
    }
))