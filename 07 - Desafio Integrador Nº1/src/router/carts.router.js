import { Router } from 'express';
import { cartsManager } from './views.router.js';
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