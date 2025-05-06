import { io } from "../app.js";
import { productsService } from "../services/products.Service.js";


export class ProductsController {
    constructor() { }

    static async postCreateProduct(req, res) {
        let {user} = req
        let { title, description, code, price, stock, category, thumbnail } = req.body;
        if (!title || !description || !code || !price || !stock || !category) {

            req.logger.warning("NO SE COMPLETARON TODOS LOS CAMPOS")

            return res.status(400).json({ error: "Debe enviar todos los campos solicitados." });}

        if (!user._id) {

            req.logger.warning("NO SE PUDO RECUERAR INFORMACION DE USUARIO")

            return res.status(500).json({ error: "Error Interno - Contacte a un administrador." });}
            
            let owner 
            if(user.role === 'premiun'){
                owner = user._id
            }

        let exReg = /[0-9]/;
        if (exReg.test(title) || exReg.test(description) || exReg.test(category)) {

            req.logger.warning("FORMATO DE EMAIL ERRONEO")

            return res.status(400).json({error:"Controlar error numerico en  los siguientes campos: title, description, category"});
        }

        let data = await productsService.createProduct(
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnail,
            owner
        );

        if (!data.success) {
            req.logger.error(data.error)

            return res.status(500).json({ error: data.error });
        }

        let productsData = await productsService.getProducts();

        io.emit("listProducts", productsData.docs);

        req.logger.info('PRODUCTOS OBTENIDOS CORRECTAMENTE')
        return res.status(201).json({ ok: data.newProduct });
    }

    static async putProductById(req, res) {
        let {user} = req
        let { id } = req.params; //lo estoy haciendo desde parametro para Postman

        let isValid = await productsService.validID(id);
        if (!isValid.valid) {
            req.logger.warning(isValid.error)
            return res.status(400).json(isValid.error);
        }
        
        let product = await productsService.getProductById(id);
        if (!product.success) {
            req.logger.warning(product.error)
            return res.status(404).json({ error: product.error });
        }
     
        
        if(user.role.toLowerCase() === "premiun" && user._id !== product.product.owner){
            req.logger.error('No puedes modificar productos no creados por usted.')
            return res.status(401).json({ error:  'No puedes modificar productos no creados por usted.'});
        }
        if (req.body._id) {
            req.logger.warning("No se puede modificar propiedad _id")
            return res
                .status(401)
                .json({ error: "NO SE PUEDE MODIFICAR LA PROPIEDAD: _ID" });
        }

        let data = await productsService.putProduct(id, req.body);
        if (!data.success) {
            req.logger.error(data.error)

            return res.status(500).json({ error: data.error });
        }

        return res.status(200).json({ ok: data.prodMod });
    }

    static async deleteProductById(req, res) {
        let { id } = req.params;
        let {user} = req
        let isValid = await productsService.validID(id);
        if (!isValid.valid) {
            req.logger.warning(isValid.error)
            return res.status(404).json({ error: isValid.error });}

        let product = await productsService.getProductById(id);
        if (!product.success) {
            req.logger.error(product.error)
            return res.status(400).json({ error: product.error });
        }

        if(user.role.toLowerCase() === "premiun" && user._id !== product.product.owner){
            req.logger.error('No puedes eliminar productos no creados por usted.')
            return res.status(401).json({ error:  'No puedes eliminar productos no creados por usted.'});
        }

        let data = await productsService.deleteProduct(id);
        if (!data.success) {
            req.logger.error(data.error)
            return res.status(500).json({ error: data.error });
        }

        let productsData = await productsService.getProducts();

        io.emit("listProducts", productsData.docs);

        return res.status(200).json({ ok: data.productDeleted });
    }
}
