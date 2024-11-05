import { chatModel } from "../models/chat.model.js"

export class ChatManager{

    async saveDatos(datos){
        try {
            let existUser = await chatModel.findOnde({user: datos.user})
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