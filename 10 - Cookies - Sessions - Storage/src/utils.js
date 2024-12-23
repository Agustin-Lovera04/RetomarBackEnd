import {fileURLToPath} from 'url';
import { dirname } from 'path';

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


export const auth = (req,res, next) => {
    if(!req.session.user){
        return res.redirect('/login?error=Acceso denegado, Inicia Sesion.')
    }
    next()
}

export const accesscontrol = (req,res,next) => { 
    if(req.session.user.rol !== 'Admin'){
        return res.redirect('/perfil?error=Acceso denegado, solo apto para Administradores.')
    }
    next()
}