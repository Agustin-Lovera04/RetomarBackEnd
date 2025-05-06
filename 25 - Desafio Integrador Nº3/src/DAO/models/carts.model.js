import mongoose from 'mongoose';

const cartsSchema = new mongoose.Schema(
    {
        title: { type: String, required: true }, 
        products: {
            type: [
                {
                    product: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'products'
                    },
                    quantity: Number
                }
            ]
        },
        status: { type: Boolean, default: true }
    }
)

cartsSchema.pre('find', function(){
    this.populate('products.product')
})

cartsSchema.pre('findOne', function(){
    this.populate('products.product')
})



export const cartsModel = mongoose.model('carts', cartsSchema)
