import passport from 'passport'
import local from 'passport-local'
import passportJWT from 'passport-jwt'
import { hashPassword, validPassword } from '../utils.js';
import { sessionService } from '../services/session.Service.js';
import { SECRETKEY } from '../app.js';
import github from 'passport-github2'
import {config} from './config.js'


const searchToken = (req) => {
    let token = null

    if(req.signedCookies.tokenCookie){
        token=req.signedCookies.tokenCookie
    }

    return token
}  

export const initPassport = () => {

    passport.use('register', new local.Strategy(
        {
            passReqToCallback: true,
            usernameField: 'email'
        },
        async(req ,username, password, done)=>{
            try {
                let {first_name, last_name, email, age ,password} = req.body
                if(!first_name || !last_name || !email || !age || !password) {
                    //Para devolver ahora utilizaremos el metodo done
                    /* return res.redirect('/register?error=Debes completar todos los campos.' */
                    return done(null, false, {message: 'Debes enviar todas los campos requeridos'})
                }
                
                if(isNaN(age)){
                    return done(null, false, {message: 'la edad debe ser un numero Valido'})
                }

                let exReg = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i
                let valid = exReg.test(email)
                if(valid === false){return done(null, false, {message: 'El formato de email ingresado es incorrecto'})}
            
                let existUser = await sessionService.searchUserByEmail(email)
                if(existUser.success){return done(null, false, {message: 'Ya existen usuarios creados con el email Ingresado'})}
                    
                let role
                if(email=== 'adminCoder@coder.com' && password === 'adminCod3r123'){role = 'Admin'}

                password = hashPassword(password)
            
                let user = await sessionService.createUser(first_name, last_name,email, age,password, role)


                if(!user.success){return done(null, false,  {message: 'Error Interno del Servidor - Contacte un administrador'})}
            
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
                    if(!username || !password){return done(null, false,  {message: 'Debes enviar todas los campos requeridos'})}
                
                    let exReg = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i
                    let valid = exReg.test(username)
                    if(valid === false){return done(null, false, {message: 'El formato de email ingresado es incorrecto'})}
                
                    /* password = crypto.createHmac("sha256", "UDMV").update(password).digest("hex") */
                
                    let existUser = await sessionService.compareUserData(username, password)
                    if(!existUser.success){return done(null, false, {message: `${existUser.error}`})}

                    
                    delete existUser.existUser.password
                    return done(null, existUser.existUser)
            } catch (error) {
                done(error)
            }
        }
    ))
    


    passport.use('github', new github.Strategy(
        {
            clientID: config.CLIENT_ID ,
            clientSecret: config.CLIENT_SECRET,
            callbackURL: config.CALLBACK_URL
        },
        async(accessToken, refreshToken, profile ,done)=>{
            try {
                //Primero debemos buscar si el usuario ya existe en BD
                //Si existe, lo buscamos por email y listo, porque tema contraseña  y eso se encarga Github
                let user = await sessionService.searchUserByEmail(profile._json.email)
                //Ahora si no existe, debemos crearlo, pero obviasmente no mandaremos la contraseña ya qeu eso es privado del usuario en github.
                //POR LO TANTO DEBI MODIFICAR EL METODO EN MANAGER PARA QUE LA CONTRASEÑA NO SEA OBLIGATORIA, al igual que en el MODELO.
                
                //Pero para evitar errores, todo lo que sea fronted, y ek resto de opciones locales, para registrar un usuario que sea obigatorio siempre quie el cliente envie una password
                
                if(!user.success){
                    user = await sessionService.createUser(profile._json.name, " GITHUB/USER ",profile._json.email, 0)
                    if(!user.success){return done(null, false,{message: 'Error Interno del Servidor - Contacte un administrador'})}
                }

                return done(null, user.user)
            } catch (error) {
                return done(error)
            }
        }
    ))
  
    

        passport.use('jwt', new passportJWT.Strategy(
            {
                secretOrKey: SECRETKEY,
                jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([searchToken])
            },
            async(contentToken, done)=> {
                try {
                    return done(null, contentToken)
                } catch (error) {
                   return done(error)
                }
            }
        ))
    }


