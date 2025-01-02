import passport from 'passport'
import local from 'passport-local'
import { hashPassword, validPassword } from '../utils.js';
import { sessionsManager } from '../router/views.router.js';
import github from 'passport-github2'



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
            
                let existUser = await sessionsManager.searchUserByEmail(email)
                if(existUser.success){return done(null, false)}
                    
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


    passport.use('login', new local.Strategy(
        {
            usernameField: 'email'
        },
        async(username, password, done)=>{
            try {
                    if(!username || !password){return done(null, false)}
                
                    let exReg = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i
                    let valid = exReg.test(username)
                    if(valid === false){return done(null, false)}
                
                    /* password = crypto.createHmac("sha256", "UDMV").update(password).digest("hex") */
                
                    let existUser = await sessionsManager.compareUserData(username, password)
                    if(!existUser.success){return done(null, false)}

                    
                    delete existUser.existUser.password
                    return done(null, existUser.existUser)
            } catch (error) {
                done(error)
            }
        }
    ))
    


    passport.use('github', new github.Strategy(
        {
            clientID: "Iv23liDMGvDJhISp9iCI",
            clientSecret: "42370b4bacf305a5849aca486e2800880b987fe4",
            callbackURL:"http://localhost:3000/api/sessions/callBackGithub"
        },
        async(accessToken, refreshToken, profile ,done)=>{
            try {
                //Primero debemos buscar si el usuario ya existe en BD
                //Si existe, lo buscamos por email y listo, porque tema contraseña  y eso se encarga Github
                let user = await sessionsManager.searchUserByEmail(profile._json.email)
                //Ahora si no existe, debemos crearlo, pero obviasmente no mandaremos la contraseña ya qeu eso es privado del usuario en github.
                //POR LO TANTO DEBI MODIFICAR EL METODO EN MANAGER PARA QUE LA CONTRASEÑA NO SEA OBLIGATORIA, al igual que en el MODELO.
                
                //Pero para evitar errores, todo lo que sea fronted, y ek resto de opciones locales, para registrar un usuario que sea obigatorio siempre quie el cliente envie una password
                
                if(!user.success){

                    user = await sessionsManager.createUser(profile._json.name,profile._json.email)
                    if(!user.success){return done(null, false)}
                }

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