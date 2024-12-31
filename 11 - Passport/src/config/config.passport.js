import passport from 'passport'
import local from 'passport-local'
import { hashPassword, validPassword } from '../utils.js';
import { sessionsManager } from '../router/views.router.js';



export const initPassport = () => {

    passport.use('register', new local.Strategy(
        {
            passReqToCallback: true,
            usernameField: 'email'
        },
        async(req ,username, password, done)=>{
            try {
                let {name, email, password} = req.body
                if(!name || !email || !password) {
                    //Para devolver ahora utilizaremos el metodo done
                    /* return res.redirect('/register?error=Debes completar todos los campos.' */
                    return done(null, false)
                    }
            
                let exReg = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i
                let valid = exReg.test(email)
                if(valid === false){return done(null, false)}
            
                let existUser = await sessionsManager.searchUserInBD(email)
                if(!existUser.success){return done(null, false)}
            
                let rol
                if(email=== 'adminCoder@coder.com' && password === 'adminCod3r123'){rol = 'Admin'}

                password = hashPassword(password)
            
                let user = await sessionsManager.createUser(name,email, password, rol)
                if(!user.success){return done(null, false)}
            
                return done(null, user.user)

            } catch (error) {
                return done(error)
            }
        }
    ))


    passport.serializeUser((user, done)=>{
        return done(null, user._id)
    })


    passport.deserializeUser(async(id, done)=>{
        let user = await sessionsManager.getUserbyId(id)
        if(!user.success){
            done(null, false)
        }
        return done(null, user.user)
    })


}