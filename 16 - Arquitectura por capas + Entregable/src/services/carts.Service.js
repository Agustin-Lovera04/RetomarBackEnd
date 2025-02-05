import { CartManager as DAO} from "../dao/manager/cart.Manager.js"

class CartsService{
    constructor(dao){
        this.dao = new dao()
    }

    static async getCarts(){
        return await this.dao.getCarts()
    }

    static async getCartById(id){
        return await this.dao.getCartById(id)
    }

}

export const cartsService = new CartsService(DAO)