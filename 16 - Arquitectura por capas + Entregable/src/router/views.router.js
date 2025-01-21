import { Router } from 'express';
import { CartManager } from '../dao/manager/cart.Manager.js';
import { chatManager } from '../app.js';
import { SessionsManager } from '../dao/manager/sessions.manager.js';
import { accessControl,  authReverse, passportCall} from '../utils.js';
import passport from 'passport';
import { ViewsController } from '../controller/viewsController.js';
export const router = Router()
export let sessionsManager = new SessionsManager()
export let cartsManager = new CartManager()

router.get('/', ViewsController.renderHome)

router.get('/products',passportCall('jwt'), accessControl(["PUBLIC"]) , ViewsController.renderProducts)


router.get('/products/:id',passportCall('jwt'), accessControl(["PUBLIC"]) ,async (req,res)=>{
    let {id} = req.params
    
    let isValid = await productsManager.validID(id)
    if(!isValid.valid){return res.status(404).json(isValid.error);}

    let product = await productsManager.getProductById(id)
    if(!product.success){return res.status(400).json({error: product.error})}


    return res.status(200).render('productDetail', {product, cartUserID:req.user.cart._id})
})

router.get('/carts',  passportCall('jwt'), accessControl(["PUBLIC"]) ,async (req,res)=>{
    let carts
    let empty = false
    try {
        carts = await cartsManager.getCarts()
        if(carts.length === 0){empty = true}

        if (req.query.limit) {carts = carts.slice(0, req.query.limit)}

        return res.status(200).render('carts', {carts , empty})

    } catch (error) {return res.status(500).json({error: error.message})}
})


router.get('/carts/:id', passportCall('jwt'), accessControl(["PUBLIC"]) ,async (req,res)=>{
    let {id} = req.params

    let isValid = await productsManager.validID(id)
    if(!isValid.valid){return res.status(404).json(isValid.error);}
    
    let cart = await cartsManager.getCartById(id)
    if(!cart.success){return res.status(400).json({error: cart.error})}
    return res.status(200).render('cartDetail', cart)
})


router.get('/chat',  passportCall('jwt'), accessControl(["PUBLIC"]) ,async (req, res) => {return res.status(200).render('chat')})

router.get('/register', authReverse,(req,res)=>{
    let {error} = req.query
    res.status(200).render('register', {error})
});

router.get('/login',authReverse,(req,res)=>{
    let {message, error} = req.query

    res.status(200).render('login', {message, error})
});

router.get('/current', passportCall('jwt'), accessControl(["PUBLIC"]),async(req,res)=>{
    let {error,warning} = req.query
    let user
    if(req.user._doc){
        user = req.user._doc
    }else{
        user = req.user
    }
    
    return res.status(200).render('current', {user: user, error, warning})
})


router.get('/testAccess',  passportCall('jwt'), accessControl(["ADMIN"]), (req,res)=>{
    return res.status(200).json({accesoConcedido: 'Eres un Administrador - MiddleWare funcionando'})
})

router.get('/*', accessControl(["PUBLIC"]), async(req,res)=> {

    return res.status(404).render('notFound');
})