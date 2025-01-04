import { Router } from 'express';
import session from 'express-session'
import { sessionsManager } from './views.router.js';
/* import crypto from 'crypto' */
import { authReverse, hashPassword, validPassword } from '../utils.js';
import { auth } from '../utils.js';
import passport from 'passport';
export const router=Router()

router.post('/register', passport.authenticate('register', {failureRedirect: '/register?error=Error en proceso de registro'}) ,async(req,res)=>{
    
    return res.redirect('/login?message=Usuario Registrado Con Exito')
})

router.post('/login', passport.authenticate('login', {failureRedirect: '/login?error=Error en proceso de login'}),async(req, res) =>{

    req.session.user = {name: req.user.name, email: req.user.email, rol: req.user.rol, _id: req.user._id}
    
    return res.redirect('/perfil')
})


router.get('/logout', auth, async (req,res)=>{
    req.session.destroy(error =>{
        if(error){ res.setHeader('Content-Type','application/json');return res.status(500).json({InternalError: error});}
    })

    return res.redirect('/login')
})



router.get('/github', authReverse , passport.authenticate('github',{}),async(req,res)=>{})

router.get('/callBackGithub', authReverse , passport.authenticate('github', {failureRedirect: '/login?error=Error en proceso de Registro con github'}), async(req,res)=>{
    
    req.session.user = {name: req.user.name, email: req.user.email, rol: req.user.rol, _id: req.user._id}
    return res.redirect('/perfil')
})