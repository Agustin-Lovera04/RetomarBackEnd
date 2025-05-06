import { Router } from 'express';
import { accessControl, passportCall, upload } from '../utils.js';
import { ProductsController } from '../controller/productsController.js';
export const router=Router()


//FRONT
router.post('/',  passportCall('jwt'), accessControl(["ADMIN", "PREMIUN"]),upload.none(), ProductsController.postCreateProduct)

//NO FRONT
router.put('/:id',passportCall('jwt'), accessControl(["ADMIN", "PREMIUN"]), ProductsController.putProductById)

//CON FRONT
router.delete('/:id', passportCall('jwt'), accessControl(["ADMIN", "PREMIUN"]), ProductsController.deleteProductById)