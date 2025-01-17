import { chatModel } from "../models/chat.model.js"

export class ChatManager{

    async getMessages(){
        try {
            let messages = await chatModel.find({}).lean()
            return messages
        } catch (error) {
            console.log(error)
            return null
        }
    }


    async saveDatos(datos){
        try {
            let existUser = await chatModel.findOne({user: datos.user})
            if(existUser){
                existUser.message.push(datos.message)
                await chatModel.updateOne({user:datos.user}, {message: existUser.message})
                return datos
            }

            await chatModel.create({user: datos.user , message: [datos.message]})
            return datos
        } catch (error) {
            return null
        }        
    }
}