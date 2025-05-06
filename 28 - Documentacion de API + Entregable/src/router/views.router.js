import { Router } from 'express';
import { SessionsManager } from '../dao/manager/sessions.manager.js';
import { accessControl,  authReverse, passportCall} from '../utils.js';
import { ViewsController } from '../controller/viewsController.js';
export const router = Router()

router.get('/', ViewsController.renderHome)
router.get('/products',passportCall('jwt'), accessControl(["PUBLIC"]) , ViewsController.getProducts)

router.get('/products/:id',passportCall('jwt'), accessControl(["PUBLIC"]) ,ViewsController.getProductById)

router.get('/carts',  passportCall('jwt'), accessControl(["PUBLIC"]) , ViewsController.getCarts)

router.get('/carts/:id', passportCall('jwt'), accessControl(["PUBLIC"]) ,ViewsController.getCartById)

router.get('/chat',  passportCall('jwt'), accessControl(["USER"]) ,ViewsController.renderChat)

router.get('/register', authReverse,ViewsController.renderRegister);

router.get('/login',authReverse,ViewsController.renderLogin);

router.get('/current', passportCall('jwt'), accessControl(["PUBLIC"]),ViewsController.renderCurrent)

router.get('/loggerTest', passportCall('jwt'), accessControl(['ADMIN']), ViewsController.testAllLogger)

router.get('/changeRole', passportCall('jwt'), accessControl(["USER", "PREMIUN"]), ViewsController.changeRole)

router.get('/restablecerPassword', accessControl(["PUBLIC"]), ViewsController.renderRestablecerPass)
router.get('/restablecerPassword2/:token', accessControl(["PUBLIC"]), passportCall('jwt'),ViewsController.renderRestablecerPass2)
router.get('/*', accessControl(["PUBLIC"]), async(req,res)=> {return res.status(404).render('notFound')})