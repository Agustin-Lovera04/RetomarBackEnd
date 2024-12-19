import { cartsModel } from "../models/carts.model.js";


export class CartManager{
    async getCarts () {
        try {
            let carts = await cartsModel.find({status: true})
            return carts
        } catch (error) {return []}
    }

    async getCartById(id){
        let success = true
        let cart
        try {
            cart = await cartsModel.findOne({_id: id, status:true})
            if(!cart){return {success: false, error:  `No se encontro carrito con el ID ingresado`}}

            return {success, cart}

        } catch (error) {return {success: false, error:  `Internal Server Error: ${error.message}`}}
    }

    async createCart(title){
        let success = true
        try {
            let newCart = await cartsModel.create({title:title})
            if(!newCart){return {success: false, error:  `Internal Server Error - Contacte con Administrador`}}
            
            return {success, newCart}

        } catch (error) {return {success: false, error:  `Internal Server Error: ${error.message}`}}
    }

    async putCart(id, title){
        let success = true
        try {
            let modCart = await cartsModel.updateOne({_id:id}, {title: title})
            if (modCart.acknowledged === false) {return {success: false, error: 'Error al modificar carrito - Contacte un Administrador'}}

            return {success,modCart}
            
        } catch (error) {return {success: false, error:  `Internal Server Error: ${error.message}`}}
    }


    async deleteCart(id){
        let success = true
        try {
            let deleteCart = await cartsModel.updateOne({_id:id}, {status: false})
            if (deleteCart.acknowledged === false) {return {success: false, error: 'Error al eliminar carrito - Contacte un Administrador'}}
            
            return {success,deleteCart}

        } catch (error) {return {success: false, error:  `Internal Server Error: ${error.message}`}}
    }
    
    async addProductInCart(cid, pid){
        let success = true
        let cart = await this.getCartById(cid)
        cart = cart.cart
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
            let addProduct = await cartsModel.updateOne({_id: cid}, {$set: {products: cart.products}})

            if(addProduct.acknowledged === false ) {return {success: false, error: 'Error al Agregar Producto al carrito - Contacte un Administrador'}}
            
            return {success ,addProduct}

        } catch (error) {return {success: false, error:  `Internal Server Error: ${error.message}`}}
}

    async deleteProductInCart(cid, pid){
        let success = true
        let cart = await this.getCartById(cid)
        cart = cart.cart
        let existProductInCart = cart.products.find((prod)=> prod.product._id.toString() === pid.toString())

        if(!existProductInCart){return {success: false, error: 'No existe producto en Carrito'}}

        try {
            //$pull Operador de mongo que elimina el primer elemento coincidente de una matriz
            let updateCart = await cartsModel.updateOne({_id: cid}, {$pull: {products: {product: pid}}})

            // ATENCION: aca podemos comparar product completo, contra PID, ya que product en BD solo aloja en product_id, Debido al Populate.
            //Entonces product: pid ====> product._id: pid

            if(updateCart.acknowledged === false) {return {success: false, error: 'Error Interno en BD - Contacte con Administrador'}}

            return {success, updateCart}

        } catch (error) {return {success: false, error:  `Internal Server Error: ${error.message}`}}
    }

    async updateAllProductsInCart(id, products){
        let success = true
    try {

        let updateCart = await cartsModel.updateOne({_id: id}, {$set: {products: products}})
        if(updateCart.acknowledged === false ) {return {success: false, error: 'Error Interno en BD - Contacte con Administrador'}}

        return {success, updateCart}

    } catch (error) {return {success: false, error:  `Internal Server Error: ${error.message}`}}}


//El operador $pull de MongoDB elimina de una matriz todas las instancias de un valor o valores que cumplan con una condición determinada
    async deleteAllProductsInCart(id){
        let success = true
        try {
            let deleteAllProductsInCart = await cartsModel.updateOne({_id: id}, {$pull: {products: {}}})
        
            if(deleteAllProductsInCart.acknowledged === false ) {return {success: false, error: 'Error Interno en BD - Contacte con Administrador'}}

            return {success, deleteAllProductsInCart}

        } catch (error) {return {success: false, error:  `Internal Server Error: ${error.message}`}}
    } 



    async updateQuantityProductInCart(cid, pid, quantity){
        let success = true

        let cart = await this.getCartById(cid)
        cart = cart.cart
        let existProductInCart = cart.products.find((prod)=> prod.product._id.toString() === pid.toString())

        if(!existProductInCart){return {success: false, error: 'No existe producto en Carrito'}}

        try {
        //En las opciones de Filtrado, ya indicamos que filtre el product conincidente con PID dentro del array products.
        //Luego en el Set usamos el operador $ ("Positional Operator") lo cual identifica el índice del producto coincidente (conseguido mediante el filtro) dentro del array.
            let updateQuantity = await cartsModel.updateOne({_id: cid, "products.product":pid}, {$set: {"products.$.quantity": quantity}})
            
            
            if(updateQuantity.acknowledged === false ) {return {success: false, error: 'Error Interno en BD - Contacte con Administrador'}}

            return {success, updateQuantity}
        } catch (error) {return {success: false, error:  `Internal Server Error: ${error.message}`}}
    }}