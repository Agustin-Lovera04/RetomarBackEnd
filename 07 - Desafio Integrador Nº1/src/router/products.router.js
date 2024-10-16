import { Router } from 'express';
import { manager } from './views.router.js';
export const router=Router()

router.post('/', async(req,res)=>{
    let {title, description, code, price, stock, category, thumbnail} = req.body

    if(!title || !description || !code || !price || !stock || !category || !thumbnail){
        return res.status(404).json({error: 'Debe enviar todos los campos solicitados.'});
    }

    let exReg = /[0-9]/;
    if (exReg.test(title) || exReg.test(description) ||
    exReg.test(category)){
        return res.status(404).json({ error: "Controlar error numerico en  los siguientes campos: title, description, category",
        })}


    let newProduct = await manager.createProduct(title, description, code, price, stock, category, thumbnail)

    if(!newProduct){
        return res.status(404).json({error: 'Server Error Internal'});
    }
})