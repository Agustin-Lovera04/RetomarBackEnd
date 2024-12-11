import { Router } from 'express';
import { productsManager } from './views.router.js';
import { upload } from '../utils.js';
import { io } from '../app.js';
export const router=Router()


router.post('/', upload.none(),async(req,res)=>{

    let {title, description, code, price, stock, category, thumbnail} = req.body

    if(!title || !description || !code || !price || !stock || !category){
        return res.status(400).json({error: 'Debe enviar todos los campos solicitados.'});
    }

    let exReg = /[0-9]/;
    if (exReg.test(title) || exReg.test(description) ||
    exReg.test(category)){
        return res.status(400).json({ error: "Controlar error numerico en  los siguientes campos: title, description, category",
        })}


    let data = await productsManager.createProduct(title, description, code, price, stock, category, thumbnail)

    if(!data.success){
        return res.status(500).json({error: data.error});
    }
    
    let productsData = await productsManager.getProducts()
    io.emit('listProducts', productsData.docs)

    return res.status(200).json({ok: data.newProduct});
})

router.put('/:id', async (req,res)=>{
    let {id} = req.params //lo estoy haciendo desde parametro para Postman

    let isValid = await productsManager.validID(id)
    if(isValid == false){
        res.setHeader('Content-Type','application/json');
        return res.status(401).json({error: 'Ingrese un ID valido'});
    }

    let product = await productsManager.getProductById(id)
    if(!product.success){return res.status(400).json({error: product.error})}



    if(req.body._id){
        return res.status(401).json({
            error: 'NO SE PUEDE MODIFICAR LA PROPIEDAD: _ID'
        });
    }


    let data = await productsManager.putProduct(id, req.body)
    if(!data.success){
        return res.status(500).json({error: data.error});
    }
    

    return res.status(200).json({
        ok: data.prodMod
    });
})

router.delete('/:id', async (req,res)=>{

    console.log('fetch recibido' + req.params.id)
    let {id} = req.params

    let isValid = await productsManager.validID(id)
    if(isValid == false){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error: 'ingrese un ID valido'});
    }

    let product = await productsManager.getProductById(id) //VER COMO HACER PARA QUE SOLO DEVUELVA UN TRUE, PARA NO ESTAR PASANDO EL PRODUCTO ENTERO INESESARIAMENTE
    if(!product.success){return res.status(400).json({error: product.error})}

    let data = await productsManager.deleteProduct(id)
    if(!data.success){
        return res.status(500).json({error: data.error});
    }

    let productsData = await productsManager.getProducts()
    io.emit('listProducts', productsData.docs)
    
    res.setHeader('Content-Type','application/json');
    return res.status(200).json({ok: data.productDeleted});
})