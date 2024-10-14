import mongoose, { mongo } from "mongoose";

export const productsModel = new mongoose.model('products', new mongoose.Schema(
    {
        title: {type: String, required: true}, 
        description: {type: String, required: true}, 
        code: {type: String, unique:true ,required: true}, 
        price: {type: Number, required: true},
        status: {
         type: Boolean, default: true
        },
        stock: {type: Number, required: true},
        category: {type: String, required: true},
        thumbnail: String
     }
))