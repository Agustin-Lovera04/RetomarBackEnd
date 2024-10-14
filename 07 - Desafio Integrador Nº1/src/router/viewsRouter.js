import { Router } from 'express';
import { cartsModel } from '../dao/models/carts.model.js';
import { chatModel } from '../dao/models/chat.model.js';
import { productsModel } from '../dao/models/products.model.js';
export const router = Router();

router.get('/',(req,res)=>{
    
    res.status(200).render('Home')
})

router.get('/products',async (req,res) =>{

    let products

    try {
        products  = await productsModel.find().lean()
        console.log(products);
        
        return res.status(200).render('products', {products})
    } catch (error) {
        console.log(error);
        
    }


})