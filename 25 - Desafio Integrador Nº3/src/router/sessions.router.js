import { Router } from 'express';
import { accessControl, genToken, passportCall, upload} from '../utils.js';
import { SessionController } from '../controller/sessionController.js';
export const router=Router()

router.post('/register', passportCall('register'), accessControl(["PUBLIC"]), SessionController.postRegister)

router.post('/login', passportCall('login'), accessControl(["PUBLIC"]),SessionController.postLogin)

router.get('/logout', passportCall('jwt'), accessControl(["PUBLIC"]), SessionController.logout)

router.get('/github', passportCall('github'),accessControl(["PUBLIC"]),async(req,res)=>{})

router.get('/callBackGithub', passportCall('github'), accessControl(["PUBLIC"]), SessionController.callBackGithub)

router.post('/changeRol', passportCall('jwt'), accessControl(["USER", "PREMIUN"]), upload.none(), SessionController.changeRole)

router.post('/rstpass1', accessControl(["PUBLIC"]), upload.none(), SessionController.rstPass1)
router.post('/rstpass2', accessControl(["PUBLIC"]), upload.none(), SessionController.rstPass2)