import mongoose from "mongoose";
import {usersModel} from '../models/user.model.js'
import { validPassword } from "../../utils.js";
import { cartsService } from "../../services/carts.Service.js";

export class SessionsManager{

    async getUserbyId(id){
        let success = true
        try {
            let user = await usersModel.findOne({_id: id})
            if(!user){return {success: false, error: `Internal Server Error - Contacte con un Administrador`}}
            
            return {success, user}
        } catch (error) {return {success: false, error: `Internal Server Error: ${error.message}}`}}
    }


    async searchUserByEmail(email){
        let success = true
        try {
            let user = await usersModel.findOne({email: email}).lean()
            if(!user){return {success: false, error: `No existen usuarios con el email: ${email}`}}
            
            return {success, user}

        } catch (error) {return {success: false, error: `Internal Server Error: ${error.message}}`}}
    }


    async createUser(first_name, last_name, email, age,password, role){
        let success = true

        let userData = {first_name: first_name, last_name: last_name, email: email, age:age}
        if(password){userData.password = password}
        if(role){userData.role = role}

        let cartUser = await cartsService.createCart(`Carro de: ${last_name}, ${first_name}`)
        if(!cartUser.success){
            return {success: false, error: `Error Interno al crear carro para nuevo usuario - Contacte un Administrador`}
        }

        userData.cart = cartUser.newCart._id

        try {
           let user =await usersModel.create(userData)
           if(!user){return {success: false, error: `Error Interno al registrar usuario - Contacte un Administrador`}}
           return {success, user}

        } catch (error) {return {success: false, error: `Internal Server Error: ${error.message}}`}}
    }



    async compareUserData(email, password){
        let success = true

        try {
            // Se usa el lean, para poder despues eliminar la propueidad password, sin problema
            let existUser = await usersModel.findOne({email: email}).lean()
            if(!existUser){return {success: false, error: `Credenciales Incorrectas`}}
            if(!validPassword(password, existUser.password)){return {success: false, error: `Credenciales Incorrectas`}}
                
            return {success, existUser}
        } catch (error) {return {success: false, error: `Internal Server Error: ${error.message}}`}}
    }

    async changeRole(uid, role){
        let success = true  
        
        try {
            let updateUserRole = await usersModel.updateOne({_id: uid}, {role: role})
            if (updateUserRole.acknowledged === false ) {return {success: false, error: 'Error al Modificar el rol - Contacte un Administrador'}}
            return {success, updateUserRole}
        } catch (error) {
            return {success: false, error : `Internal Server Error: ${error.message}}`}
        }
    }

    async updatePass(datosToken, hashPassword){
        let success = true
        try {
            let updatePass = await usersModel.updateOne({_id: datosToken._id}, {password: hashPassword})
            if (updatePass.acknowledged === false ) {return {success: false, error: 'Error al Modificar la contraseña - Contacte un Administrador'}}
            return {success, updatePass}

        } catch (error) {
            return {success: false, error : `Internal Server Error: ${error.message}}`}
        }
    }
    }
