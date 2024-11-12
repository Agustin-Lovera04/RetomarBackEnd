import mongoose from 'mongoose';

const cartsSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, unique: true }, 
        products: { type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products'
                }
            }
        ]},
        status: { type: Boolean, default: true }
    }
)

cartsSchema.pre("findOne", function () {
    this.populate('products.product'),
    this.lean()
})




export const cartsModel = mongoose.model('Carts', cartsSchema)