import { ProductsManager as DAO } from "../DAO/manager/products.manager.js"

class ProductsService{
    constructor(dao){
        this.dao = new dao()
    }

    async validID(id){
        return await this.dao.validID(id)
    }

    async getProducts(page,limit,sort,category,disp){
        return await this.dao.getProducts(page,limit,sort,category,disp)
    }


    async getProductById(id){
        return await this.dao.getProductById(id)
    }

    async createProduct(title,description,code,price,stock,category,thumbnail){
        return await this.dao.createProduct(title,description,code,price,stock,category,thumbnail)
    }

    async putProduct(id, body){
        return await this.dao.putProduct(id, body)
    }

    async deleteProduct(id){
        return await this.dao.deleteProduct(id)
    }


}

export const productsService = new ProductsService(DAO)