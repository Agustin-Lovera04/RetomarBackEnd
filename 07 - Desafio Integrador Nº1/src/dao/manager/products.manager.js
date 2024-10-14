import { productsModel } from "../models/products.model.js";

export class ProductsManager{

    async getProducts(){
        let products
        try {
            products  = await productsModel.find().lean()            
            return products
        } catch (error) {
            console.log(error);   
        }
    }
}