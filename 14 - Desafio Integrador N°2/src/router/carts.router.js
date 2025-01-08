import { Router } from 'express';
import { cartsManager, productsManager } from './views.router.js';
import { accessControl, passportCall, upload } from '../utils.js';
import { io } from '../app.js';
import { auth } from '../utils.js';
import passport from 'passport';
export const router=Router()

//Con FRONT------------------------------
router.post('/:title',passportCall('jwt'), accessControl(["PUBLIC"]),async (req,res)=>{
    let {title} = req.params

    if(!title){return res.status(400).json({error:'Debe enviar un titulo para el carrito' })}

    let data = await cartsManager.createCart(title)
    if(!data.success){return res.status(400).json({error: data.error});}

    io.emit('listCarts', await cartsManager.getCarts())

    return res.status(200).json({ok: data.newCart});
})

//Con FRONT------------------------------

router.put('/modCart/:id', passportCall('jwt'), accessControl(["PUBLIC"]),upload.none(),async (req,res) => {
    let {id} = req.params
    let {title} = req.body

    let idValid = await productsManager.validID(id)
    if(!idValid.valid){return res.status(400).json({error: idValid.error})}

    if(!title){return res.status(400).json({error: 'Debe enviar el nuevo titulo para carrito'})}
    
    let cart = await cartsManager.getCartById(id)
    if(!cart.success){return res.status(400).json({error: cart.error})}

    let data = await cartsManager.putCart(id, title)
    if(!data.success){return res.status(400).json({error: data.error});}

    io.emit('listCarts', await cartsManager.getCarts())

    return res.status(200).json({ok: data.modCart})
})


//Con FRONT------------------------------

router.delete('/deleteCart/:id', passportCall('jwt'), accessControl(["PUBLIC"]),async (req,res)=>{
    let {id} = req.params

    let idValid = await productsManager.validID(id)
    if(!idValid.valid){return res.status(400).json({error: idValid.error})}

    let cart = await cartsManager.getCartById(id)
    if(!cart.success){return res.status(400).json({error: cart.error})}
  
    let data = await cartsManager.deleteCart(id)
    if(!data.success){return res.status(400).json({error: data.error})}

    io.emit('listCarts', await cartsManager.getCarts())
    return res.status(200).json({ok: data.deleteCart})
})


//Con FRONT------------------------------
router.post('/:cid/product/:pid',passportCall('jwt'), accessControl(["PUBLIC"]), async (req,res) =>{
    let {cid, pid} = req.params
    let cidIsValid = await productsManager.validID(cid)
    let pidIsValid = await productsManager.validID(pid)

    if(cidIsValid == false || pidIsValid == false){return res.status(400).json({error: 'Debe enviar IDs Validos'})}

    const product = await productsManager.getProductById(pid)
    if(!product.success){return res.status(400).json({error: product.error})}

    const cart = await cartsManager.getCartById(cid)
    if(!cart.success){return res.status(400).json({error: cart.error})}


    if(!cart.cart.products || !Array.isArray(cart.cart.products)){return res.status(500).json({error: 'Estructura no Apta en carrito - Contacte con Administrador'})}

    let data = await cartsManager.addProductInCart(cid, pid)
    if(!data.success){return res.status(400).json({error: data.error})}

    return res.status(200).json({ok: data.addProduct})
})



//sin FRONT
router.delete('/:cid/product/:pid', passportCall('jwt'), accessControl(["PUBLIC"]),async (req, res) => {
    let {cid, pid} = req.params
    let cidIsValid = await productsManager.validID(cid)
    let pidIsValid = await productsManager.validID(pid)

    if(!cidIsValid.valid || !pidIsValid.valid){return res.status(400).json({error: 'Debe enviar IDs Validos'})}

    const product = await productsManager.getProductById(pid)
    if(!product.success){return res.status(400).json({error: product.error})}

    
    const cart = await cartsManager.getCartById(cid)
    if(!cart.success){return res.status(400).json({error: cart.error})}

    if(!cart.cart.products || !Array.isArray(cart.cart.products)){return res.status(500).json({error: 'Estructura no Apta en carrito - Contacte con Administrador'})}

    let deleteProductInCart = await cartsManager.deleteProductInCart(cid,pid)
    if(!deleteProductInCart.success){return res.status(400).json({error: deleteProductInCart.error})}

    return res.status(200).json({ok: deleteProductInCart});
})

//Sin FRONT---------

/*EJEMPLO DE BODY {
  "products": [{ "product":"670d54db878577e86fbd871f" ,"quantity": 2},{"product":"670d54db878577e86fbd8722","quantity": 5}]}*/

router.put('/:id', passportCall('jwt'), accessControl(["PUBLIC"]),async (req,res) => {
    let {id} = req.params
    let {products} = req.body

    let idValid = await productsManager.validID(id)
    if(!idValid.valid){return res.status(400).json({error: idValid.error})}

    const cart = await cartsManager.getCartById(id)
    if(!cart.success){return res.status(400).json({error: cart.error})}

    if(!products || !Array.isArray(products)){return res.status(400).json({error: 'Debe enviar el nuevo listado de productos para el carrito - Controlar estructura correcta de listado'})}

    /* USAMOS METODO FOR OF ( for of (recomendado para arrays antes que for in)), porque el bucle FOR espera a que la iteracion de cada elemento se resuelva, y ante el primer comando de corte como "break o return" Detiene y sale del bucle
    En cambio forEach es asincronico, no espera la resolucion de cada elemento entonces genera errores por multiples respuestas etc */
    for (const product of products) {

        let prod = await productsManager.getProductById(product.product)
        if(!prod.success){return res.status(400).json({error: prod.error})}


        if(product._id){return res.status(400).json({error: 'No esta permitido generar la propiedad _id'})}

        if(!product.quantity){return res.status(400).json({error: 'Debe enviar el campo quantity: Number'})}
    }
 

    let updateCart = await cartsManager.updateAllProductsInCart(id, products)
    if(!updateCart.success){return res.status(400).json({error: updateCart.error})}

    return res.status(200).json({ok: updateCart});
})



//SOlucionando error de estructuara no apta para borrar

//Sin FRONT---------
router.delete('/:id',passportCall('jwt'), accessControl(["PUBLIC"]),async (req,res) =>{
    let {id} = req.params
    let idIsValid = await productsManager.validID(id)
    if(!idIsValid.valid){return res.status(400).json({error: idIsValid.error})}

    const cart = await cartsManager.getCartById(id)
    if(!cart.success){return res.status(400).json({error: cart.error})}

    if(!cart.cart.products || !Array.isArray(cart.cart.products)){return res.status(500).json({error: 'Estructura no Apta en carrito - Contacte con Administrador'})}

    let deleteAllProductsInCart = await cartsManager.deleteAllProductsInCart(id)

    if(!deleteAllProductsInCart.success){return res.status(500).json({error: deleteAllProductsInCart.error});}

    return res.status(200).json({ok: deleteAllProductsInCart});
})


router.put('/:cid/product/:pid',passportCall('jwt'), accessControl(["PUBLIC"]),async (req,res)=>{
    let {cid, pid} = req.params
    let {quantity} = req.body
    let cidIsValid = await productsManager.validID(cid)
    let pidIsValid = await productsManager.validID(pid)

    if(!cidIsValid.valid || !pidIsValid.valid){return res.status(400).json({error: 'Debe enviar IDs Validos'})}

    const product = await productsManager.getProductById(pid)
    if(!product.success){return res.status(400).json({error: product.error})}

    const cart = await cartsManager.getCartById(cid)
    if(!cart.success){return res.status(400).json({error: cart.error})}


    if(!cart.cart.products || !Array.isArray(cart.cart.products)){return res.status(500).json({error: 'Estructura no Apta en carrito - Contacte con Administrador'})}

    Number(quantity)
    if(!quantity || isNaN(quantity) === true || quantity <= 0){return res.status(404).json({error: ' Debe enviar la propiedad quantity, con un numero valido'})}

    let updateQuantityProductInCart = await cartsManager.updateQuantityProductInCart(cid, pid, quantity)
    if(!updateQuantityProductInCart.success){return res.status(500).json({error: updateQuantityProductInCart.error})}


    return res.status(200).json({ok: updateQuantityProductInCart})
})