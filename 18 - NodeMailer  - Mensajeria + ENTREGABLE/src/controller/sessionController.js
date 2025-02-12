import { genToken } from "../utils.js"

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
}