import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

import multer from 'multer'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
    }
})

export const upload = multer()


/* export const auth = (req,res, next) => {

    if(!req.session.user){
        return res.redirect('/login?error=Acceso denegado, Inicia Sesion.')
    }
    next()
}

 */
/* export const authReverse = (req,res, next) => {
    if(req.session.user){
        return res.redirect('/perfil?warning=Ya has Iniciado Session.')
    }
    next()
} */

/* export const accessControl = (req,res,next) => { 
    if(req.session.user.rol !== 'Admin'){
        return res.redirect('/perfil?error=Acceso denegado, solo apto para Administradores.')
    }
    next()
}
 */

export const SECRETKEY = "UDMV"

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



export const genToken = (user) => jwt.sign({...user}, SECRETKEY, {expiresIn:"1h"})
