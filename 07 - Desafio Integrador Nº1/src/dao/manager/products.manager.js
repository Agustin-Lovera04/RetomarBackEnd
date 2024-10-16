import mongoose from "mongoose";
import { productsModel } from "../models/products.model.js";

export class ProductsManager{


    async validID(id){
        let valid
        if(!mongoose.Types.ObjectId.isValid(id)){
            return valid = false
        }
        return valid=true
    }


    async getProducts(){
        let products
        try {
            products  = await productsModel.find().lean()
            return products
        } catch (error) {
            console.log(error);   
        }
    }

    async getProductById(id){
        let product
        try {
            product = await productsModel.findOne({_id: id}).lean()
            return product
        } catch (error) {
            console.log(error);   
        }
    }


    async createProduct(title, description, code, price, stock, category, thumbnail){
        try {

            let newProduct = await productsModel.create({title: title, description: description, code: code, price: Number(price), stock:Number(stock), category: category, thumbnail: thumbnail})

            return newProduct

        } catch (error) {
            return null
        }
    }
}