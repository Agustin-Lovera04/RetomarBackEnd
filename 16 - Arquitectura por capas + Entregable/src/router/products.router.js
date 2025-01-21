import { Router } from 'express';
import { productsManager } from '../controller/viewsController.js';
import { accessControl, passportCall, upload } from '../utils.js';
import { auth } from '../utils.js';
import { io } from '../app.js';
import passport from 'passport';
export const router=Router()

//FRONT
router.post('/',  passportCall('jwt'), accessControl(["ADMIN"]),upload.none(),async(req,res)=>{

    let {title, description, code, price, stock, category, thumbnail} = req.body
    if(!title || !description || !code || !price || !stock || !category){return res.status(400).json({error: 'Debe enviar todos los campos solicitados.'})}

    let exReg = /[0-9]/;
    if (exReg.test(title) || exReg.test(description) ||exReg.test(category)){return res.status(400).json({ error: "Controlar error numerico en  los siguientes campos: title, description, category"})}

    let data = await productsManager.createProduct(title, description, code, price, stock, category, thumbnail)

    if(!data.success){return res.status(500).json({error: data.error})}
    
    let productsData = await productsManager.getProducts()

    io.emit('listProducts', productsData.docs)

    return res.status(200).json({ok: data.newProduct});
})

//NO FRONT
router.put('/:id',passportCall('jwt'), accessControl(["ADMIN"]),async (req,res)=>{
    let {id} = req.params //lo estoy haciendo desde parametro para Postman

    let isValid = await productsManager.validID(id)
    if(!isValid.valid){return res.status(404).json(isValid.error);}


    let product = await productsManager.getProductById(id)
    if(!product.success){return res.status(400).json({error: product.error})}

    if(req.body._id){return res.status(401).json({error: 'NO SE PUEDE MODIFICAR LA PROPIEDAD: _ID'})}

    let data = await productsManager.putProduct(id, req.body)
    if(!data.success){return res.status(500).json({error: data.error})}

    return res.status(200).json({ok: data.prodMod})
})

//CON FRONT
router.delete('/:id', passportCall('jwt'), accessControl(["ADMIN"]),async (req,res)=>{
    let {id} = req.params

    let isValid = await productsManager.validID(id)
    if(!isValid.valid){return res.status(404).json({error: isValid.error})}

    let product = await productsManager.getProductById(id)
    if(!product.success){return res.status(400).json({error: product.error})}

    let data = await productsManager.deleteProduct(id)
    if(!data.success){return res.status(500).json({error: data.error})}
    
    let productsData = await productsManager.getProducts()

    io.emit('listProducts', productsData.docs)

    return res.status(200).json({ok: data.productDeleted});
})