import { Router } from 'express';
import session from 'express-session'
import { sessionsManager } from './views.router.js';
/* import crypto from 'crypto' */
import { hashPassword, validPassword } from '../utils.js';
import { auth } from '../utils.js';
import passport from 'passport';
export const router=Router()

router.post('/register', passport.authenticate('register', {failureRedirect: '/register?error=Error en proceso de registro'}) ,async(req,res)=>{
    
    return res.redirect('/login?message=Usuario Registrado Con Exito')
})

router.post('/login', async(req, res) =>{
    let {email, password} = req.body
    if(!email || !password){return res.redirect('/login?error=Debes completar todos los campos.')}

    let exReg = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i
    let valid = exReg.test(email)
    if(valid === false){return res.redirect('/login?error=Debes enviar un email valido.')}

    /* password = crypto.createHmac("sha256", "UDMV").update(password).digest("hex") */

    let existUser = await sessionsManager.compareUserData(email, password)
    if(!existUser.success){return res.redirect(`/login?error=${existUser.error}`)}


    req.session.user = {name: existUser.existUser.name, email: email, rol: existUser.existUser.rol}

    return res.redirect('/perfil')
})


router.get('/logout', auth, async (req,res)=>{
    req.session.destroy(error =>{
        if(error){ res.setHeader('Content-Type','application/json');return res.status(500).json({InternalError: error});}
    })

    return res.redirect('/login')
})