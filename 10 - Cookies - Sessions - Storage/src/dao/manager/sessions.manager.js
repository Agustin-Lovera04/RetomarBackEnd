import mongoose from "mongoose";
import {usersModel} from '../models/user.model.js'

export class SessionsManager{

    async searchUserInBD(email){
        let success = true
        try {
            let existUser = await usersModel.findOne({email: email})
            if(existUser){
                return {success: false, error: `Ya existen usuarios con el email: ${email}}`}
            }
            return {success}
        } catch (error) {
            return {success: false, error: `Internal Server Error: ${error.message}}`}
        }
    }


    async createUser(name, email, password){
        let success = true
        try {
           let user =await usersModel.create({name: name, email: email, password: password})
           if(!user){
            return {success: false, error: `Error Interno al registrar usuario - Contacte un Administrador`}
           }

           return {success, user}
        } catch (error) {
            return {success: false, error: `Internal Server Error: ${error.message}}`}
        }
    }

}