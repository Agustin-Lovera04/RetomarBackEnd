import { Router } from 'express';
import { ProductsManager } from '../dao/manager/products.manager.js';
import { CartManager } from '../dao/manager/cart.Manager.js';
import { chatManager } from '../app.js';
export const router = Router();

export let productsManager = new ProductsManager()
export let cartsManager = new CartManager()



router.get('/',(req,res)=>{
    res.status(200).render('Home')
})


router.get('/products',async (req,res) =>{
    let empty = false
    let {page, limit, sort, category, disp} = req.query    

    if(!page){
        page = null
    }

    if(!limit){
        limit = null
    }

    if(sort){
       sort = Number(sort)
        
    }
    
    if(!sort || sort !== 1 && sort !== -1){
        sort = null
    }
    
    let query={
        disp: disp || true
    }

    if(category){
        query.category = category
    }


    try {
        let data = await productsManager.getProducts(page, limit, sort, query)

        let {docs, totalPages, hasNextPage, hasPrevPage, prevPage, nextPage} = data

        let products = docs
        
        if(products.length === 0){
            empty = true
        }


        return res.status(200).render('products', {products , empty, totalPages, hasNextPage, hasPrevPage, prevPage, nextPage})
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({error: error.message,});
    }
})


router.get('/products/:id', async (req,res)=>{
    let {id} = req.params
    
    let isValid = await productsManager.validID(id)
    if(isValid == false){
        res.setHeader('Content-Type','application/json');
        return res.status(404).json({error: 'Ingrese un ID valido'});
    }

    let product = await productsManager.getProductById(id)
    if(!product){
        res.setHeader('Content-Type','application/json');
        return res.status(404).json({error: 'No se encontro producto con el Id ingresado'});
    }

    return res.status(200).render('productDetail', {product})
})



router.get('/carts', async (req,res)=>{
    let carts
    let empty = false
    try {
        
        carts = await cartsManager.getCarts()
        if(carts.length === 0){
            empty = true
        }

        if (req.query.limit) {
            carts = carts.slice(0, req.query.limit);
        }
        console.log(carts)
        return res.status(200).render('carts', {carts , empty})

    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({error: error.message,});
    }
})


router.get('/carts/:id', async (req,res)=>{
    let {id} = req.params

    let isValid = await productsManager.validID(id)
    if(isValid == false){
        res.setHeader('Content-Type','application/json');
        return res.status(404).json({error: 'Ingrese un ID valido'});
    }
    
    let cart = await cartsManager.getCartById(id)
    if(!cart){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error: 'No se encontro carrito con el ID ingresado'});
    }
    console.log(cart.products)
    return res.status(200).render('cartDetail', {cart})
})


router.get('/chat', async (req, res) => {
    return res.status(200).render(
        'chat');
})