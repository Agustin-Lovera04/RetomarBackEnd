import { Router } from 'express';
import { cartsManager, productsManager } from './views.router.js';
import { upload } from '../utils.js';
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


router.put('/:id', upload.none(),async (req,res) => {
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
            error: 'internal server error'
        });
    }

    io.emit('listCarts', await cartsManager.getCarts())

    return res.status(200).json({
        ok: modifiedCart,
    });
})


router.delete('/:id', async (req,res)=>{
    let {id} = req.params

    let isValid = await productsManager.validID(id)
    if(isValid == false){
        return res.status(400).json({
            error: 'Debe enviar un ID valido'
        })
    }

    let cart = await cartsManager.getCartById(id)
    if(!cart){
        return res.status(400).json({
            error: 'No se encontro carrito con el ID ingresado'
        })
    }

  
    let deleteCart = await cartsManager.deleteCart(id)
    if(!deleteCart){
        return res.status(500).json({
            error: 'internal server error'
        });
    }

    
    io.emit('listCarts', await cartsManager.getCarts())
    return res.status(200).json({
        ok: deleteCart
    });

})



router.post('/:cid/product/:pid', async (req,res) =>{
    let {cid, pid} = req.params
    let cidIsValid = await productsManager.validID(cid)
    let pidIsValid = await productsManager.validID(pid)

    if(cidIsValid == false || pidIsValid == false){
        res.setHeader('Content-Type','application/json')
        return res.status(400).json({error: 'Debe enviar IDs Validos'})
    }

    const product = await productsManager.getProductById(pid)
    if(!product){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error: 'No existe producto con el ID ingresado'});        
    }
    const cart = await cartsManager.getCartById(cid)
    if(!cart){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error: 'Carrito Inexistente'});
    }

    if(!cart.products || !Array.isArray(cart.products)){
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({error: 'Estructura no Apta en carrito - Contacte con Administrador'});
    }

    let addProductInCart = await cartsManager.addProductInCart(cid, product)
    if(!addProductInCart){
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({error: 'Server Error'});
    }


    res.setHeader('Content-Type','application/json');
    return res.status(200).json({ok: addProductInCart});
})