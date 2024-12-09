import { cartsModel } from "../models/carts.model.js";


export class CartManager{
    async getCarts () {
        try {
            let carts = await cartsModel.find({status: true})
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


    async addProductInCart(cid, pid){
        let cart = await this.getCartById(cid)
        let existProductInCart = cart.products.find((prod)=> prod.product._id.toString() === pid.toString())

        if (existProductInCart) {
            existProductInCart.quantity++
        } else {
            cart.products.push({
                product: pid,
                quantity: 1
            })
        }
        try {
            let updateCart = await cartsModel.updateOne({_id: cid}, {$set: {products: cart.products}})

            if(updateCart.modifiedCount == 0 ) {
                console.log('Server Error')
                return null
            }
            return updateCart

        } catch (error) {
            console.log('Error: ' + error)
        }

}


async deleteProductInCart(cid, pid){
    let success = true
    let cart = await this.getCartById(cid)
    let existProductInCart = cart.products.find((prod)=> prod.product._id.toString() === pid.toString())

    if(!existProductInCart){
        return {success: false, error: 'No existe producto en Carrito'}
    }

    try {
        //$pull Operador de mongo que elimina el primer elemento coincidente de una matriz
        let updateCart = await cartsModel.updateOne({_id: cid}, {$pull: {products: {product: pid}}})

        // ATENCION: aca podemos comparar product completo, contra PID, ya que product en BD solo aloja en product_id, Debido al Populate.
        //Entonces product: pid ====> product._id: pid


        if(updateCart.modifiedCount == 0 ) {
            return {success: false, error: 'Error Interno en BD - Contacte con Administrador'}
        }
        return {success, updateCart}

    } catch (error) {
        return {success: false, error:  `Internal Server Error: ${error.message}`}
    }
}



async updateAllProductsInCart(id, products){
    let success = true
try {
    
    let updateCart = await cartsModel.updateOne({_id: id}, {$set: {products: products}})
    
    if(updateCart.modifiedCount == 0 ) {
        return {success: false, error: 'Error Interno en BD - Contacte con Administrador'}
    }
    return {success, updateCart}
} catch (error) {
    return {success: false, error:  `Internal Server Error: ${error.message}`}
}}

}