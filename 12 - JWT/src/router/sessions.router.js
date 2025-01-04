import { Router } from 'express';
import { sessionsManager } from './views.router.js';
/* import crypto from 'crypto' */
import { /* authReverse, */ genToken,/*  hashPassword, validPassword */ } from '../utils.js';
import { auth } from '../utils.js';
import passport from 'passport';
import jwt from 'jsonwebtoken'
export const router=Router()

router.post('/register', passport.authenticate('register', {session:false,failureRedirect: '/register?error=Error en proceso de registro'}) ,async(req,res)=>{
    
    return res.redirect('/login?message=Usuario Registrado Con Exito')
})

router.post('/login', passport.authenticate('login', {session:false,failureRedirect: '/login?error=Error en proceso de login'}),async(req, res) =>{

    /* req.session.user = {name: req.user.name, email: req.user.email, rol: req.user.rol, _id: req.user._id} */
    
    let token = await genToken(req.user)
    res.cookie("tokenCookie", token, {maxAge: 1000*60*60, httpOnly: true, signed:true})


    return res.redirect('/perfil')
})


router.get('/logout', /* auth,  */async (req,res)=>{
    let cookie = req.signedCookies.tokenCookie;

    if (!cookie) {
        return res.status(500).json({ InternalError: 'Error Interno' });
    }

    await res.clearCookie('tokenCookie', {signed: true})
    return res.redirect('/login')
})



router.get('/github', passport.authenticate('github',{session:false}),async(req,res)=>{})

router.get('/callBackGithub', passport.authenticate('github', {session:false,failureRedirect: '/login?error=Error en proceso de Registro con github'}), async(req,res)=>{
    
    /* req.session.user = {name: req.user.name, email: req.user.email, rol: req.user.rol, _id: req.user._id} */
    
    let token = await genToken(req.user)
    res.cookie("tokenCookie", token, {maxAge: 1000*60*60, httpOnly: true, signed:true})


    return res.redirect('/perfil')
})