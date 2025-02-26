import { CartManager as DAO} from "../DAO/manager/cart.Manager.js"

class CartsService{
    constructor(dao){
        this.dao = new dao()
    }

    async getCarts(){
        return await this.dao.getCarts()
    }

    async getCartById(id){
        return await this.dao.getCartById(id)
    }

    async createCart(title){
        return await this.dao.createCart(title)
    }

    async putCart(id,title){
        return this.dao.putCart(id,title)
    }

    async deleteCart(id){
        return this.dao.deleteCart(id)
    }

    async addProductInCart(cid,pid){
        return await this.dao.addProductInCart(cid,pid)
    }

    async deleteProductInCart(cid,pid){
        return await this.dao.deleteProductInCart(cid,pid)
    }

    async updateAllProductsInCart(id, product){
        return await this.dao.updateAllProductsInCart(id,products)
    }

    async deleteAllProductsInCart(id){
        return await this.dao.deleteAllProductsInCart(id)
    }

    async putQuantityProductInCart(cid,pid,quantity){
        return await this.dao.putQuantityProductInCart(cid,pid,quantity)
    }

}

export const cartsService = new CartsService(DAO)