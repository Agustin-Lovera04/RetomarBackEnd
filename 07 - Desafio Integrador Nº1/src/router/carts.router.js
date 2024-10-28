import { Router } from 'express';
import { cartsManager, productsManager } from './views.router.js';
import multer from 'multer';
import { io } from '../app.js';
export const router=Router()


router.post('/:title', async (req,res)=>{
    let {title} = req.params

    if(!title){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:'Debe enviar un titulo para el carrito' });
    }

    let newCart = await cartsManager.createCart(title)

    if(!newCart){
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({error: 'Error Internal Server'});
    }

    io.emit('listCarts', await cartsManager.getCarts())
    res.setHeader('Content-Type','application/json');
    return res.status(200).json({ok: newCart});
})


router.put('/:id', async (req,res) => {
    let {id} = req.params
    let {title} = req.body

    let isValid = await productsManager.validID(id)
    if(isValid == false){
        return res.status(400).json({
            error: 'Debe enviar un ID valido'
        });
    }

    if(!title){
        return res.status(400).json({
            error: 'Debe enviar el nuevo titulo para carrito'
        });
    }

    let cart = await cartsManager.getCartById(id)
    if(!cart){
        return res.status(400).json({
            error: ' No se encontro carrito con el Id ingresado'
        });
    }

    let modifiedCart = await cartsManager.putCart(id, title)
    if(!modifiedCart){
        return res.status(500).json({
            error: 'internal server error' + error.message,
        });
    }

    return res.status(200).json({
        ok: modifiedCart,
    });
})