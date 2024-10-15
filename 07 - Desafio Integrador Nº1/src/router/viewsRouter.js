import { Router } from 'express';
import { ProductsManager } from '../dao/manager/products.manager.js';
export const router = Router();

let manager = new ProductsManager()



router.get('/',(req,res)=>{
    
    res.status(200).render('Home')
})

router.get('/products',async (req,res) =>{
    let products
    let empty = false
    try {
        products = await manager.getProducts()

        if(products.length === 0){
            empty = true
        }

        if (req.query.limit) {
            products = products.slice(0, req.query.limit);
          }

        return res.status(200).render('products', {products , empty})
    } catch (error) {
        
    }
})


router.get('/products/:id', async (req,res)=>{
    let {id} = req.params
    
    let isValid = await manager.validID(id)
    if(isValid == false){
        res.setHeader('Content-Type','application/json');
        return res.status(404).json({error: 'Ingrese un ID valido'});
    }

    let product = await manager.getProductById(id)
    if(!product){
        res.setHeader('Content-Type','application/json');
        return res.status(404).json({error: 'No se encontro producto con el Id ingresado'});
    }

    return res.status(200).render('productDetail', {product})
})