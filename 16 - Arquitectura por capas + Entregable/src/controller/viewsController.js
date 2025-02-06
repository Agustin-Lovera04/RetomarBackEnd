import { cartsService } from "../services/carts.Service.js"
import { productsService } from "../services/products.Service.js"

export class ViewsController{
    constructor(){}

    static async renderHome(req,res){
       return res.status(200).render('Home')
    }

    static async getProducts(req,res){
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
                let data = await productsService.getProducts(page, limit, sort, category, disp)
        
                let {docs, totalPages, hasNextPage, hasPrevPage, prevPage, nextPage} = data
        
                let products = docs
                
                if(products.length === 0){empty = true}
                //Acomodamos el status segun la consigna, ya que todo salio bien
                status.success = true

                return res.status(200).render('products', {status, cartUserID: req.user.cart._id, payload: {products} , empty, totalPages, hasNextPage, hasPrevPage, prevPage, nextPage})
            
            } catch (error) {return res.status(500).json({error: error.message})}
        
    }


    static async getProductById(req,res){
            let {id} = req.params
            
            try {
                let isValid = await productsService.validID(id)
                if(!isValid.valid){return res.status(404).json(isValid.error);}
                
                let product = await productsService.getProductById(id)
                if(!product.success){return res.status(400).json({error: product.error})}
                
                
                return res.status(200).render('productDetail', {product, cartUserID:req.user.cart._id})
            } catch (error) {return res.status(500).json({error: error.message})}
    }



    static async getCarts(req,res){
            let carts
            let empty = false
            try {
                carts = await cartsService.getCarts()
                if(carts.length === 0){empty = true}
        
                if (req.query.limit) {carts = carts.slice(0, req.query.limit)}
        
                return res.status(200).render('carts', {carts , empty})
        
            } catch (error) {return res.status(500).json({error: error.message})}
    }



    static async getCartById(req,res){
        let {id} = req.params
        try {
                let isValid = await productsService.validID(id)
                if(!isValid.valid){return res.status(404).json(isValid.error);}
                
                let cart = await cartsService.getCartById(id)
                if(!cart.success){return res.status(400).json({error: cart.error})}
                return res.status(200).render('cartDetail', cart)
        } catch (error) {return res.status(500).json({error: error.message});}
    }


    static renderChat (req,res){
        return res.status(200).render('chat')
    }

    static renderRegister(req,res){
            let {error} = req.query
            res.status(200).render('register', {error})
    }

    static renderLogin(req,res){
            let {message, error} = req.query
        
            res.status(200).render('login', {message, error})
    }

    static renderCurrent(req,res){
            let {error,warning} = req.query
            let user
            if(req.user._doc){
                user = req.user._doc
            }else{
                user = req.user
            }
            
            return res.status(200).render('current', {user: user, error, warning})
    }

}