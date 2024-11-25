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


    async getProducts(page, limit, sort, query){
        try {
            let setFilter = {}

            //Hacemos esa comparacion final, para que si el string que llega no es igual a 'true', el resultado sea un BOLEAN, que nos sirva para el filtro, y que deje de ser el string 'false' que llega originalmente
            setFilter.status = query.disp === 'false' ? false : true;

            
            if(query.category){
                setFilter.category = query.category
            }


            let options = {
                page: page || 1,
                limit: limit || 10,
            }
            //Solo si existe sort, le agregamos una propiedad mas a las options de filtro para consulta a BD
            if(sort){
                options.sort = {price: sort}
            }
            console.log(setFilter)
            let products  = await productsModel.paginate(setFilter, options)
            return products

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