import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
    {
        //code: autogenerarlo
        purchase_datatime: {type: Date, default: Date.now},
        amount: Number,
        purchaser: String
    }
)