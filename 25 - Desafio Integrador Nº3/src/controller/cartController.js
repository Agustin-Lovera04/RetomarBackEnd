import { io } from "../app.js";
import { cartsService } from "../services/carts.Service.js";
import { productsService } from "../services/products.Service.js";

export class CartController {
  constructor() {}

  static async postCreateCart(req, res) {
    let { title } = req.params;

    if (!title) {
      return res
        .status(400)
        .json({ error: "Debe enviar un titulo para el carrito" });
    }

    let data = await cartsService.createCart(title);
    if (!data.success) {

      req.logger.error(`ERROR INTERNO ${data.error}`)

      return res.status(400).json({ error: data.error });
    }

    io.emit("listCarts", await cartsService.getCarts());


    req.logger.info('Carrito creado con exito')
    return res.status(200).json({ ok: data.newCart });
  }

  static async putCartById(req,res){
        let {id} = req.params
        let {title} = req.body
    
        let idValid = await productsService.validID(id)
        if(!idValid.valid){return res.status(400).json({error: idValid.error})}
    
        if(!title){return res.status(400).json({error: 'Debe enviar el nuevo titulo para carrito'})}
        
        let cart = await cartsService.getCartById(id)
        if(!cart.success){return res.status(400).json({error: cart.error})}
    
        let data = await cartsService.putCart(id, title)
        if(!data.success){
            req.logger.error(`ERROR INTERNO ${data.error}`)

            return res.status(500).json({error: data.error});}
    
        io.emit('listCarts', await cartsService.getCarts())
    
        return res.status(200).json({ok: data.modCart})
  }


  static async deleteCartById(req,res){
        let {id} = req.params
    
        let idValid = await productsService.validID(id)
        if(!idValid.valid){return res.status(400).json({error: idValid.error})}
    
        let cart = await cartsService.getCartById(id)
        if(!cart.success){return res.status(400).json({error: cart.error})}
      
        let data = await cartsService.deleteCart(id)
        if(!data.success){
            req.logger.error(`ERROR INTERNO ${data.error}`)
            return res.status(400).json({error: data.error})}
    
        io.emit('listCarts', await cartsService.getCarts())
        return res.status(200).json({ok: data.deleteCart})
  }


  static async postProductInCart(req,res){
        let {cid, pid} = req.params
        let {user} = req

        let cidIsValid = await productsService.validID(cid)
        let pidIsValid = await productsService.validID(pid)
        if(cidIsValid == false || pidIsValid == false){return res.status(400).json({error: 'Debe enviar IDs Validos'})}

        if(cid !== user.cart._id){return res.status(404).json({error: 'Solo puedes agregar productos a tu carrito'})}   

        const product = await productsService.getProductById(pid)
        if(!product.success){return res.status(400).json({error: product.error})}
    
        if(user.role.toLowerCase() === "premiun" && user._id === product.product.owner){
          req.logger.error('No puedes agregar al carrito productos creados por usted.')
          return res.status(401).json({ error:  'No puedes agregar al carrito productos creados por usted.'});
      }



        const cart = await cartsService.getCartById(cid)
        if(!cart.success){return res.status(400).json({error: cart.error})}
    
    
        if(!cart.cart.products || !Array.isArray(cart.cart.products)){
            req.logger.error(`Estructura no apta en carrito`)
            return res.status(500).json({error: 'Estructura no Apta en carrito - Contacte con Administrador'})}
    
        let data = await cartsService.addProductInCart(cid, pid)
        if(!data.success){
            req.logger.error(`ERROR INTERNO ${data.error}`)
            return res.status(400).json({error: data.error})}
    
        return res.status(200).json({ok: data.addProduct})
  }

  static async deleteProductInCart(req,res){
        let {cid, pid} = req.params
        let cidIsValid = await productsService.validID(cid)
        let pidIsValid = await productsService.validID(pid)
    
        if(!cidIsValid.valid || !pidIsValid.valid){return res.status(400).json({error: 'Debe enviar IDs Validos'})}
    
        const product = await productsService.getProductById(pid)
        if(!product.success){return res.status(400).json({error: product.error})}
    
        
        const cart = await cartsService.getCartById(cid)
        if(!cart.success){return res.status(400).json({error: cart.error})}
    
        if(!cart.cart.products || !Array.isArray(cart.cart.products)){return res.status(500).json({error: 'Estructura no Apta en carrito - Contacte con Administrador'})}
    
        let deleteProductInCart = await cartsService.deleteProductInCart(cid,pid)
        if(!deleteProductInCart.success){
            req.logger.error(`ERROR INTERNO ${deleteProductInCart.error}`)
            return res.status(400).json({error: deleteProductInCart.error})}
    
        return res.status(200).json({ok: deleteProductInCart});
  }


  static async putArrayProductsInCart(req,res){
        let {id} = req.params
        let {products} = req.body
    
        let idValid = await productsService.validID(id)
        if(!idValid.valid){return res.status(400).json({error: idValid.error})}
    
        const cart = await cartsService.getCartById(id)
        if(!cart.success){return res.status(400).json({error: cart.error})}
    
        if(!products || !Array.isArray(products)){
            req.logger.warning(`Debe enviar un listado con estructura correcta para modificar el carrito`)
            return res.status(400).json({error: 'Debe enviar el nuevo listado de productos para el carrito - Controlar estructura correcta de listado'})}
    
        /* USAMOS METODO FOR OF ( for of (recomendado para arrays antes que for in)), porque el bucle FOR espera a que la iteracion de cada elemento se resuelva, y ante el primer comando de corte como "break o return" Detiene y sale del bucle
        En cambio forEach es asincronico, no espera la resolucion de cada elemento entonces genera errores por multiples respuestas etc */
        for (const product of products) {
    
            let prod = await productsService.getProductById(product.product)
            if(!prod.success){
                  req.logger.error(`${prod.error}`)
                  
                  return res.status(400).json({error: prod.error})}
    
    
            if(product._id){
                  req.logger.warning(`No se puede modificar la propiedad _id`)
                  
                  return res.status(400).json({error: 'No esta permitido generar la propiedad _id'})}
    
            if(!product.quantity){
                  req.logger.warning(`No envio el campo quantity`)
                  
                  return res.status(400).json({error: 'Debe enviar el campo quantity: Number'})}
        }
     
    
        let updateCart = await cartsService.updateAllProductsInCart(id, products)
        if(!updateCart.success){
            req.logger.error(`ERROR INTERNO ${updateCart.error}`)
            
            return res.status(400).json({error: updateCart.error})}
    
        return res.status(200).json({ok: updateCart});
  }


  static async deleteAllProductsInCart(req,res){
        let {id} = req.params
        let idIsValid = await productsService.validID(id)
        if(!idIsValid.valid){return res.status(400).json({error: idIsValid.error})}
    
        const cart = await cartsService.getCartById(id)
        if(!cart.success){return res.status(400).json({error: cart.error})}
    
        if(!cart.cart.products || !Array.isArray(cart.cart.products)){return res.status(500).json({error: 'Estructura no Apta en carrito - Contacte con Administrador'})}
    
        let deleteAllProductsInCart = await cartsService.deleteAllProductsInCart(id)
    
        if(!deleteAllProductsInCart.success){
            req.logger.error(`ERROR INTERNO ${deleteAllProductsInCart.error}`)
            
            return res.status(500).json({error: deleteAllProductsInCart.error});}
    
        return res.status(200).json({ok: deleteAllProductsInCart});
  }


  static async putQuantityProductInCart(req,res){
    let {cid, pid} = req.params
    let {quantity} = req.body
    let cidIsValid = await productsService.validID(cid)
    let pidIsValid = await productsService.validID(pid)

    if(!cidIsValid.valid || !pidIsValid.valid){return res.status(400).json({error: 'Debe enviar IDs Validos'})}

    const product = await productsService.getProductById(pid)
    if(!product.success){return res.status(400).json({error: product.error})}

    const cart = await cartsService.getCartById(cid)
    if(!cart.success){return res.status(400).json({error: cart.error})}


    if(!cart.cart.products || !Array.isArray(cart.cart.products)){return res.status(500).json({error: 'Estructura no Apta en carrito - Contacte con Administrador'})}

    Number(quantity)
    if(!quantity || isNaN(quantity) === true || quantity <= 0){return res.status(404).json({error: ' Debe enviar la propiedad quantity, con un numero valido'})}

    let updateQuantityProductInCart = await cartsService.updateQuantityProductInCart(cid, pid, quantity)
    if(!updateQuantityProductInCart.success){
      req.logger.error(`ERROR INTERNO ${updateQuantityProductInCart.error}`)
      
      return res.status(500).json({error: updateQuantityProductInCart.error})}


    return res.status(200).json({ok: updateQuantityProductInCart})
  }


  static async finallyBuy(req,res){
      console.log(req.body)
  }
}
