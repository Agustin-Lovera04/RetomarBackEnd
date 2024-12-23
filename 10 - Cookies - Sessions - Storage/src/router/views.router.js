import { Router } from 'express';
import { ProductsManager } from '../dao/manager/products.manager.js';
import { CartManager } from '../dao/manager/cart.Manager.js';
import { chatManager } from '../app.js';
import { SessionsManager } from '../dao/manager/sessions.manager.js';
import session from 'express-session'
import { accesscontrol, auth } from '../utils.js';
export const router = Router()
export let productsManager = new ProductsManager()
export let sessionsManager = new SessionsManager()
export let cartsManager = new CartManager()

router.get('/',(req,res)=>{
    res.status(200).render('Home')
})


router.get('/products',async (req,res) =>{
    let empty = false
    let status = {}

    let {disp} = req.query
//Validaciones para corroborar que disp acepte los valores eexactos, y los convierta luego en utilizables para el filter de consulta a BD    
    if(disp === "true"){
        disp = true
    }else if(disp === "false"){
        disp = false
    }else(disp = true)

    let {category} = req.query
    if(!category){category = undefined}

    let {page} = req.query
    if(!page){page = 1}

    let {limit} = req.query
    if(!limit){limit = 10}

    let {sort} = req.query
    if(sort){sort = Number(sort)}
    if(sort !==-1 && sort !==1){sort = undefined}

    
    try {
        let data = await productsManager.getProducts(page, limit, sort, category, disp)

        let {docs, totalPages, hasNextPage, hasPrevPage, prevPage, nextPage} = data

        let products = docs
        
        if(products.length === 0){empty = true}
        //Acomodamos el status segun la consigna, ya que todo salio bien
        status.success = true
        return res.status(200).render('products', {status, payload: {products} , empty, totalPages, hasNextPage, hasPrevPage, prevPage, nextPage})
    
    } catch (error) {return res.status(500).json({error: error.message,})}
})


router.get('/products/:id', async (req,res)=>{
    let {id} = req.params
    
    let isValid = await productsManager.validID(id)
    if(!isValid.valid){return res.status(404).json(isValid.error);}

    let product = await productsManager.getProductById(id)
    if(!product.success){return res.status(400).json({error: product.error})}

    return res.status(200).render('productDetail', product)
})

router.get('/carts', async (req,res)=>{
    let carts
    let empty = false
    try {
        carts = await cartsManager.getCarts()
        if(carts.length === 0){empty = true}

        if (req.query.limit) {carts = carts.slice(0, req.query.limit)}

        return res.status(200).render('carts', {carts , empty})

    } catch (error) {return res.status(500).json({error: error.message})}
})


router.get('/carts/:id', async (req,res)=>{
    let {id} = req.params

    let isValid = await productsManager.validID(id)
    if(!isValid.valid){return res.status(404).json(isValid.error);}
    
    let cart = await cartsManager.getCartById(id)
    if(!cart.success){return res.status(400).json({error: cart.error})}
    return res.status(200).render('cartDetail', cart)
})


router.get('/chat', async (req, res) => {return res.status(200).render('chat')})

router.get('/register',(req,res)=>{
    let {error} = req.query
    res.status(200).render('register', {error})
});

router.get('/login',(req,res)=>{
    let {message, error} = req.query

    res.status(200).render('login', {message, error})
});

router.get('/perfil', auth ,async(req,res)=>{
    let {error} = req.query
    let user = req.session.user

    return res.status(200).render('perfil', {user: user, error})
})

router.get('/testAccess', auth, accesscontrol, (req,res)=>{
    return res.status(200).json({accesoConcedido: 'Eres un Administrador - MiddleWare funcionando'})
})