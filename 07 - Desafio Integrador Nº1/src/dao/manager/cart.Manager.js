import { cartsModel } from "../models/carts.model.js";


export class CartManager{
    async getCarts () {
        try {
            let carts = await cartsModel.find({status: true}).lean()
            return carts
        } catch (error) {
            console.log(error.message)
            return []
        }
    }

    async getCartById(id){
        let cart
        try {
            cart = await cartsModel.findOne({_id: id}).lean()
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

}