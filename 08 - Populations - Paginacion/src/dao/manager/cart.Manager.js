import { cartsModel } from "../models/carts.model.js"

export class CartManager{
    async getCarts () {
        try {
            let carts = await cartsModel.find({status: true}).populate('products.product')
            return carts
        } catch (error) {
            console.log(error.message)
            return []
        }
    }

    async getCartById(id){
        let cart
        try {
            cart = await cartsModel.findOne({_id: id, status:true})
            return cart
        } catch (error) {
            console.log(error.message)
            return null
        }
    }

    async createCart(title){
        try {
            let newCart = await cartsModel.create({title:title})
            return newCart
        } catch (error) {
            console.log(error.message)
            return null
        }
    }

    async putCart(id, title){
        try {
            let modCart = await cartsModel.updateOne({_id:id}, {title: title})
            if (modCart.modifiedCount == 0) {
                return null
            }
            return modCart
        } catch (error) {
            console.log(error)
            return null
        }
    }


    async deleteCart(id){
        try {
            let deleteCart = await cartsModel.updateOne({_id:id}, {status: false})
            if (deleteCart.modifiedCount == 0) {
                return null
            }
            return deleteCart
        } catch (error) {
            console.log(error)
            return null            
        }
    }


    async addProductInCart(cid, product){
        let cart = await this.getCartById(cid)
        console.log(cart)
        let existProductInCart = cart.products.find((prod)=> prod.product._id.toString() === product._id.toString())

        if (existProductInCart) {
            existProductInCart.quantity++
        } else {
            cart.products.push({
                product: product._id,
                quantity: 1
            })
        }


        try {
            let updateCart = await cartsModel.updateOne({_id: cid}, {$set: {products: cart.products}})

            if(updateCart.modifiedCount == 0 ) {
                return null
            }

            return updateCart

        } catch (error) {
            console.log('Error: ' + error)
        }

}

}