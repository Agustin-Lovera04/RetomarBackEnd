import { SECRETKEY } from "../app.js"
import { enviarMail } from "../mails/mails.js"
import { sessionService } from "../services/session.Service.js"
import jwt from 'jsonwebtoken'
import { genToken, hashPassword } from "../utils.js"


export class SessionController{
    constructor(){}

    static postRegister(req,res){
        return res.redirect('/login?message=Usuario Registrado Con Exito')
    }


    static async postLogin(req,res){
            let token = await genToken(req.user)
            res.cookie("tokenCookie", token, {maxAge: 1000*60*60, httpOnly: true, signed:true})
        
            return res.redirect('/current')
    }


    static async logout (req,res){
            let cookie = req.signedCookies.tokenCookie;
        
            if (!cookie) {
                req.logger.error(`ERROR INTERNO ${cookie}`)
                return res.status(500).json({ InternalError: 'Error Interno' });
            }
        
            await res.clearCookie('tokenCookie', {signed: true})
            return res.redirect('/login')
    }

    static async callBackGithub(req,res){
        let token = await genToken(req.user)
        res.cookie("tokenCookie", token, {maxAge: 1000*60*60, httpOnly: true, signed:true})
    
    
        return res.redirect('/current')
    }



    static async changeRole(req,res){
        let {role} = req.body
        let {user} = req
        if(!role || !user){
            return res.status(500).json({InternalError: 'Error Interno - Contacte un administrador'});
        }

        if(user.role === role){
            return res.status(409).json({error: `Ya eres: ${role}`});
        }

        let uid = user._id
        let changeRole = await sessionService.changeRole(uid, role)
        if(!changeRole.success){
            return res.status(404).json({error: changeRole.error});
        }

        return res.status(200).json({ok: 'cambio de rol exitoso'});
    }


    static async rstPass1 (req,res){
        let {email} = req.body

        let user = await sessionService.searchUserByEmail(email)
        if(!user.success){
            res.setHeader('Content-Type','application/json');
            return res.status(404).json({error: user.error});
        }

        let token = await genToken(user.user)
        let mensaje=`Hola. Ha solicitado reiniciar... 
        Haga click en el siguiente link: <a href="http://localhost:3000/restablecerPassword2/${token}">Resetear Contraseña</a>
        Si no genero un reseteto... `

        let confirmSend = await enviarMail(email, "recupero", mensaje)
        if(!confirmSend.success){
            return res.status(404).json({error: confirmSend.error});
        }
        return res.status(200).json(confirmSend.send);
    }

    static async rstPass2(req,res){
        let {password1, token} = req.body

       let pass =hashPassword(password1)

       let updatePass = await sessionService.updatePass(datosToken, pass)
       if(!updatePass.success){
        res.setHeader('Content-Type','application/json');
        return res.status(404).json({error: updatePass.error});
       }
       res.setHeader('Content-Type','application/json');
       return res.status(200).json({ok: 'reestablecida la contraseña'});
    }
}