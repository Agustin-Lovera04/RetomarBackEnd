import mongoose from "mongoose";
import { productsModel } from "../models/products.model.js";

export class ProductsManager{


    async validID(id){
        let valid = true
        if(!mongoose.Types.ObjectId.isValid(id)){return {valid: false, error: 'Debe enviar un ID valido'}}
        return {valid}
    }


    async getProducts(page, limit, sort, category, disp){
        try {
            //Por recomendacion de la documentacion de mongo, estabelcemos parametros generales de Filtro(filter) y de Orden(options)
            let options = {page: page || 1,limit: limit || 10}
            
            if(sort !== undefined){options.sort = { price: sort}}

        //Pametro General de Filtros para cosulta
            let filter = {}
            filter.status = disp || true

            if(category !== undefined){filter.category = category}

//La razón por la que funciona es que los métodos como .find() o .paginate() están diseñados para aceptar un objeto como argumento, donde las claves son los nombres de los campos de la colección y los valores son las condiciones de búsqueda.
            let products  = await productsModel.paginate(filter, options)
            console.log(products)
            return products

        } catch (error) {return []}
    }

    async getProductById(id){
        let success = true
        let product
        try {
            product = await productsModel.findOne({_id: id})
            if(!product){return {success: false, error:  `No se encontro producto con el ID ingresado`}}

            return {success, product}

        } catch (error) {return {success: false, error:  `Internal Server Error: ${error.message}`}}
    }


    async createProduct(title, description, code, price, stock, category, thumbnail){
        let success = true
        try {
            let newProduct = await productsModel.create({title: title, description: description, code: code, price: Number(price), stock:Number(stock), category: category, thumbnail: thumbnail})

            if(!newProduct){return {success: false, error: 'Error al Crear Producto - Contacte un Administrador'}}

            return {success, newProduct}

        } catch (error) {return {success: false, error:  `Internal Server Error: ${error.message}`}}
    }

    async putProduct(id, body){
        let success = true
        try {
            let prodMod = await productsModel.updateOne({ _id: id }, body)
            if (prodMod.acknowledged === false ) {return {success: false, error: 'Error al Modificar Producto - Contacte un Administrador'}}
        
            return {success,prodMod}
        
        } catch (error) {return {success: false, error:  `Internal Server Error: ${error.message}`}}
    }

    async deleteProduct(id){
        let success = true
        try {
            let productDeleted = await productsModel.updateOne({_id:id}, {$set: {status: false}})
            if(productDeleted.acknowledged === false ){return {success: false, error: 'Error al Borrar Producto - Contacte un Administrador'}}

            return {success,productDeleted}

        } catch (error) {return {success: false, error:  `Internal Server Error: ${error.message}`}}
    }
}