import { Router } from 'express';
import { accessControl, genToken, passportCall,} from '../utils.js';
export const router=Router()

router.post('/register', passportCall('register'), accessControl(["PUBLIC"]),async(req,res)=>{
    
    return res.redirect('/login?message=Usuario Registrado Con Exito')
})

router.post('/login', passportCall('login'), accessControl(["PUBLIC"]),async(req, res) =>{

    /* req.session.user = {name: req.user.name, email: req.user.email, rol: req.user.rol, _id: req.user._id} */
    
    let token = await genToken(req.user)
    res.cookie("tokenCookie", token, {maxAge: 1000*60*60, httpOnly: true, signed:true})


    return res.redirect('/perfil')
})


router.get('/logout', passportCall('jwt'), accessControl(["PUBLIC"]),async (req,res)=>{
    let cookie = req.signedCookies.tokenCookie;

    if (!cookie) {
        return res.status(500).json({ InternalError: 'Error Interno' });
    }

    await res.clearCookie('tokenCookie', {signed: true})
    return res.redirect('/login')
})



router.get('/github', passportCall('github'),async(req,res)=>{})

router.get('/callBackGithub', passportCall('github'), async(req,res)=>{
    
    /* req.session.user = {name: req.user.name, email: req.user.email, rol: req.user.rol, _id: req.user._id} */
    
    let token = await genToken(req.user)
    res.cookie("tokenCookie", token, {maxAge: 1000*60*60, httpOnly: true, signed:true})


    return res.redirect('/perfil')
})