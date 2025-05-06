import { Router } from 'express';
import { accessControl, passportCall, upload } from '../utils.js';
import { CartController } from '../controller/cartController.js';
export const router=Router()

//Con FRONT------------------------------
router.post('/:title',passportCall('jwt'), accessControl(["ADMIN"]),CartController.postCreateCart)

//Con FRONT------------------------------
router.put('/modCart/:id', passportCall('jwt'), accessControl(["ADMIN"]),upload.none(),CartController.putCartById)

//Con FRONT------------------------------
router.delete('/deleteCart/:id', passportCall('jwt'), accessControl(["ADMIN"]),CartController.deleteCartById)

//Con FRONT------------------------------
router.post('/:cid/product/:pid',passportCall('jwt'), accessControl(["USER", "PREMIUN", "ADMIN"]), CartController.postProductInCart)

//sin FRONT
router.delete('/:cid/product/:pid', passportCall('jwt'), accessControl(["USER", "ADMIN"]),CartController.deleteProductInCart)

//Sin FRONT---------
/*EJEMPLO DE BODY 
  "products": [{ "product":"670d54db878577e86fbd871f" ,"quantity": 2},{"product":"670d54db878577e86fbd8722","quantity": 5}]}*/

router.put('/:id', passportCall('jwt'), accessControl(["USER", "ADMIN"]), CartController.putArrayProductsInCart)



//SOlucionando error de estructuara no apta para borrar

//Sin FRONT---------
router.delete('/:id',passportCall('jwt'), accessControl(["USER", "ADMIN"]), CartController.deleteAllProductsInCart)


router.put('/:cid/product/:pid',passportCall('jwt'), accessControl(["USER", "ADMIN"]),CartController.putQuantityProductInCart)