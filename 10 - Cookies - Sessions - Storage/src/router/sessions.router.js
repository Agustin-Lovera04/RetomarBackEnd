import { Router } from 'express';
import session from 'express-session'
import { sessionsManager } from './views.router.js';
import crypto from 'crypto'
import { auth } from '../utils.js';
export const router=Router()

router.post('/register',async(req,res)=>{
    let {name, email, password} = req.body
    if(!name || !email || !password) {return res.redirect('/register?error=Debes completar todos los campos.')}

    let exReg = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i
    let valid = exReg.test(email)
    if(valid === false){return res.redirect('/register?error=Debes enviar un email valido.')}

    let existUser = await sessionsManager.searchUserInBD(email)
    if(!existUser.success){return res.redirect(`/register?error=${existUser.error}`)}

    let rol
    if(email=== 'adminCoder@coder.com' && password === 'adminCod3r123'){rol = 'Admin'}

    password = crypto.createHmac("sha256", "UDMV").update(password).digest("hex")

    let user = await sessionsManager.createUser(name,email, password, rol)
    if(!user.success){return res.redirect(`/register?error=${user.error}`)}

    res.redirect('/login?message=Usuario Registrado Con Exito')
})

router.post('/login', async(req, res) =>{
    let {email, password} = req.body
    if(!email || !password){return res.redirect('/login?error=Debes completar todos los campos.')}

    let exReg = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i
    let valid = exReg.test(email)
    if(valid === false){return res.redirect('/login?error=Debes enviar un email valido.')}

    password = crypto.createHmac("sha256", "UDMV").update(password).digest("hex")

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