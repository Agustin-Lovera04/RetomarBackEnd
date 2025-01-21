import { ProductsManager } from "../dao/manager/products.manager.js"

export let productsManager = new ProductsManager()

export class ViewsController{
    constructor(){}

    static async renderHome(req,res){
       return res.status(200).render('Home')
    }

    static async renderProducts(req,res){
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

                return res.status(200).render('products', {status, cartUserID: req.user.cart._id, payload: {products} , empty, totalPages, hasNextPage, hasPrevPage, prevPage, nextPage})
            
            } catch (error) {return res.status(500).json({error: error.message,})}
        
    }
}