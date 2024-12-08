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


router.put('/modCart/:id', upload.none(),async (req,res) => {
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

    let addProductInCart = await cartsManager.addProductInCart(cid, pid)
    if(!addProductInCart){
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({error: 'Server Error'});
    }


    res.setHeader('Content-Type','application/json');
    return res.status(200).json({ok: addProductInCart});
})



router.delete('/:cid/product/:pid', async (req, res) => {
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

    let deleteProductInCart = await cartsManager.deleteProductInCart(cid,pid)
    if(!deleteProductInCart.success){
        return res.status(400).json({error: deleteProductInCart.error});
    }

    res.setHeader('Content-Type','application/json');
    return res.status(200).json({ok: deleteProductInCart});
})


//Sin FRONT
/*EJEMPLO DE BODY {
  "products": [
    { "product":"670d54db878577e86fbd871f" ,
    "quantity": 2},
    { "product":"670d54db878577e86fbd8722",
    "quantity": 5}
  ]
} */
router.put('/:id', async (req,res) => {
    let {id} = req.params
    let {products} = req.body
    let idIsValid = await productsManager.validID(id)

    if(idIsValid == false){
        res.setHeader('Content-Type','application/json')
        return res.status(400).json({error: 'Debe enviar IDs Validos'})
    }

    const cart = await cartsManager.getCartById(id)
    if(!cart){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error: 'Carrito Inexistente'});
    }

    if(!products || !Array.isArray(products)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error: 'Debe enviar el nuevo listado de productos para el carrito - Controlar estructura correcta de listado'});
    }

    /* USAMOS METODO FOR OF ( for of (recomendado para arrays antes que for in)), porque el bucle FOR espera a que la iteracion de cada elemento se resuelva, y ante el primer comando de corte como "break o return" Detiene y sale del bucle
    En cambio forEach es asincronico, no espera la resolucion de cada elemento entonces genera errores por multiples respuestas etc */
    for (const product of products) {  
        if(product._id){
            return res.status(400).json({error: 'No esta permitido generar la propiedad _id'});
        }
       if(!product.quantity){
            return res.status(400).json({error: 'Debe enviar el campo quantity: Number'});
        }
    }
 

    let updateCart = await cartsManager.updateAllProductsInCart(id, products)
    if(!updateCart.success){
        return res.status(400).json({error: updateCart.error});
    }

    res.setHeader('Content-Type','application/json');
    return res.status(200).json({ok: updateCart});
})