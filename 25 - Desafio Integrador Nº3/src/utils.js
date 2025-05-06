import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import passport from 'passport';
import multer from 'multer'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
    }
})

export const upload = multer()



export const passportCall = (strategy) => function (req, res, next) {
    passport.authenticate(strategy, function (err, user, info, status) {
        if (err) { return next(err) }
        if (!user) {
           //return res.status(404).json({error: info.message ? info.message : info.toString()});
           return res.render('login', {error: info.message})
        }
        req.user = user
        return next()
    })(req, res, next);
}


export const accessControl = (access = []) => function (req, res , next){ 
    access = access.map(permission => permission.toLowerCase())
    
    if(access.includes("public")){
        return next()
    }
    
    if(!access.includes(req.user.role.toLowerCase())){
        return res.status(404).json({error: "ACCESO DENEGADO, No tienes privilegios para el accesso a este recurso"});
    }
    next()
}

export const authReverse = (req,res, next) => {
    if(req.signedCookies.tokenCookie){
        return res.redirect('/current?warning=Ya has Iniciado Session.')
    }
    next()
}


//QUEDA SIN USAR
/* import { config } from './config/config.js'; */
/* export const SECRETKEY = /* config.SECRET_KEY_TOKEN */
import { SECRETKEY } from './app.js';

export const auth = async (req,res,next)=>{
    if(!req.signedCookies.tokenCookie){
        return res.status(404).json({error: 'Acceso Denegado, debes iniciar session'});
    }


    let token = req.signedCookies.tokenCookie
    try {
        let user = await jwt.verify(token, SECRETKEY)
        req.user = user
        next()
    } catch (error) {
        return res.status(404).json({error: error});
    }

}


//hashSync para que espere que se complete el hash
//GenSatlSync, mientras mas saltos, mas seguro, pero mas demora, recomendado 10
export const hashPassword = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const validPassword = ( enteredPassword , password) => bcrypt.compareSync( enteredPassword , password)



export const genToken = (user) => jwt.sign({...user}, SECRETKEY, {expiresIn:"10s"})
