import { ChatManager as DAO } from "../dao/manager/chat.manager.js"
class ChatService{
    constructor(dao){
        this.dao = new dao()
    }

    async saveDatos(datos){
        return await this.dao.saveDatos(datos)
    }
}


export const chatService = new ChatService(DAO)