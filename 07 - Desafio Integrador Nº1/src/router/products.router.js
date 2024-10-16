import { Router } from 'express';
import { manager } from './views.router.js';
import multer from 'multer'
import { io } from '../app.js';
export const router=Router()

/* MANEJO DE FORM DATA */
const upload = multer()

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


    let newProduct = await manager.createProduct(title, description, code, price, stock, category, thumbnail)

    if(!newProduct){
        return res.status(500).json({error: 'Server Error Internal'});
    }
    

    io.emit('listProducts', await manager.getProducts())

    return res.status(200).json({ok: newProduct});
})