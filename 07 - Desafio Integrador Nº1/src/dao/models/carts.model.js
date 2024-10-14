import mongoose from 'mongoose';

export const cartsModel = mongoose.model('Carts', new mongoose.Schema(
    {
        title: { type: String, required: true, unique: true }, 
        products: { type: Array, default: [] },
        status: { type: Boolean, default: true }
    }
));