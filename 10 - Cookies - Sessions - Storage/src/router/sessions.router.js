import { Router } from 'express';
import { sessionsManager } from './views.router.js';
import crypto from 'crypto'
export const router=Router()

router.post('/register',async(req,res)=>{
    let {name, email, password} = req.body
    if(!name || !email || !password) {
        return res.redirect('/register?error=Debes completar todos los campos.')
    }

    let exReg = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i
    let valid = exReg.test(email)
    if(valid === false){
        return res.redirect('/register?error=Debes enviar un email valido.')
    }

    let existUser = await sessionsManager.searchUserInBD(email)
    if(!existUser.success){
        return res.redirect(`/register?error=${existUser.error}`)
    }

    password = crypto.createHmac("sha256", "UDMV").update(password).digest("hex")

    
    let user = await sessionsManager.createUser(name,email, password)
    if(!user.success){
        return res.redirect(`/register?error=${user.error}`)
    }

    res.redirect('/login?message=Usuario Registrado Con Exito')
})