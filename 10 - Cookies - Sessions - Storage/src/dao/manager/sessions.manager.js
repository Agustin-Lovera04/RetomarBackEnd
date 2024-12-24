import mongoose from "mongoose";
import {usersModel} from '../models/user.model.js'

export class SessionsManager{

    async getUserbyId(id){
        let success = true
        try {
            let user = await usersModel.findOne({_id: id})
            if(!user){return {success: false, error: `Internal Server Error - Contacte con un Administrador`}}
            
            return {success, user}
        } catch (error) {return {success: false, error: `Internal Server Error: ${error.message}}`}}
    }


    async searchUserInBD(email){
        let success = true
        try {
            let existUser = await usersModel.findOne({email: email})
            if(existUser){return {success: false, error: `Ya existen usuarios con el email: ${email}`}}
            
            return {success}

        } catch (error) {return {success: false, error: `Internal Server Error: ${error.message}}`}}
    }


    async createUser(name, email, password, rol){
        let success = true
        
        let userData = {name: name, email: email, password: password}

        if(rol){userData.rol = rol}

        try {
           let user =await usersModel.create(userData)
           if(!user){return {success: false, error: `Error Interno al registrar usuario - Contacte un Administrador`}}

           return {success, user}

        } catch (error) {return {success: false, error: `Internal Server Error: ${error.message}}`}}
    }



    async compareUserData(email, password){
        let success = true

        try {
            let existUser = await usersModel.findOne({email: email, password: password})
            if(!existUser){return {success: false, error: `Credenciales Incorrectas`}}
 
            return {success, existUser}
        } catch (error) {return {success: false, error: `Internal Server Error: ${error.message}}`}}
    }
}