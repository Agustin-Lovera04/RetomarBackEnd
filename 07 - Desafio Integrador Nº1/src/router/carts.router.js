import { Router } from 'express';
import { cartsManager } from './views.router.js';
export const router=Router()

router.post('/', async (req,res)=>{
    let {title} = req.body

    if(!title){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:'Debe enviar un titulo para el carrito' });
    }

    let newCart = await cartsManager.createCart(title)

    if(!newCart){
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({InternalError: 'Error Internal Server'});
    }

    res.setHeader('Content-Type','application/json');
    return res.status(200).json({ok: newCart});
})