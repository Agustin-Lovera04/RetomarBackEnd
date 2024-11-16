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


    async getProducts(page){
        let products
        try {
            products  = await productsModel.paginate({status: true}, {limit: 5, page: page})
            
            let {totalPages, hasNextPage, hasPrevPage, prevPage, nextPage} = products

            return{ products:products.docs, totalPages, hasNextPage, hasPrevPage, prevPage, nextPage}
        } catch (error) {
            console.log(error);
            return []
        }
    }

    async getProductById(id){
        let product
        try {
            product = await productsModel.findOne({_id: id})
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

    async putProduct(id, body){
        try {
            let prodMod = await productsModel.updateOne({ _id: id }, body)
            if (prodMod.modifiedCount == 0) {
                return null
            }
            return prodMod
        
        } catch (error) {
            console.log(error)
            return null
        }
    }

    async deleteProduct(id){
        let productDeleted = await this.getProductById(id)
        try {
            productDeleted = await productsModel.updateOne({_id:id}, {$set: {status: false}})
            if(productDeleted.modifiedCount == 0){
                return null
            }

            return productDeleted
        } catch (error) {
            console.log(error)
            return null
        }
    }
}