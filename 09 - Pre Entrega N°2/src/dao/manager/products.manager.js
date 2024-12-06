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


    async getProducts(page, limit, sort, category, disp){
        try {
            //Por recomendacion de la documentacion de mongo, estabelcemos parametros generales de Filtro(filter) y de Orden(options)
            let options = {
                page: page,
                limit: limit
            }
            
            if(sort !== undefined){
                options.sort = { price: sort}
            }

        //Pametro General de Filtros para cosulta
            let filter = {}


            if(disp !== undefined){
                filter.status = disp
            }

            if(category !== undefined){
                filter.category = category
            }


//La razón por la que funciona es que los métodos como .find() o .paginate() están diseñados para aceptar un objeto como argumento, donde las claves son los nombres de los campos de la colección y los valores son las condiciones de búsqueda.

            let products  = await productsModel.paginate(filter, options)

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