import { Router } from 'express';
import { accessControl, passportCall, upload } from '../utils.js';
import { ProductsController } from '../controller/productsController.js';
export const router=Router()

//FRONT
router.post('/',  passportCall('jwt'), accessControl(["ADMIN"]),upload.none(), ProductsController.postCreateProduct)

//NO FRONT
router.put('/:id',passportCall('jwt'), accessControl(["ADMIN"]), ProductsController.putProductById)

//CON FRONT
router.delete('/:id', passportCall('jwt'), accessControl(["ADMIN"]), ProductsController.deleteProductById)