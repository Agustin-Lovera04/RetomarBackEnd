import { Router } from 'express';
import { ProductsManager } from '../dao/manager/products.manager.js';
export const router = Router();

let manager = new ProductsManager()

router.get('/',(req,res)=>{
    
    res.status(200).render('Home')
})

router.get('/products',async (req,res) =>{
    let products
    try {
        products = await manager.getProducts()
        return res.status(200).render('products', {products})
    } catch (error) {
        
    }
})