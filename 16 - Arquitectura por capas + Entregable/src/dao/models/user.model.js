import mongoose from "mongoose";


export const usersSchema = new mongoose.Schema(
    {
        first_name: {type: String, required: true},
        last_name: {type: String, required: true},
        email: {type: String, required: true, unique:true},
        password: {type: String},
        age: {type: Number},
        cart:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'carts'
        },
        role: {type: String, default: 'user'}
    },
    {
        timestamps: true
    }
)


usersSchema.pre('find', function () {
    this.populate('cart')
})

usersSchema.pre('findOne', function () {
    this.populate('cart')
})


export const usersModel = mongoose.model('users', usersSchema)