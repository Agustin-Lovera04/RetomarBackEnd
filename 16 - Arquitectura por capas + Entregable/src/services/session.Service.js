import { SessionsManager as DAO} from "../dao/manager/sessions.manager.js"

class SessionService{
    constructor(dao){
        this.dao = new dao()
    }

    async searchUserByEmail(email){
        return await this.dao.searchUserByEmail(email)
    }

    async createUser(first_name, last_name, email, age, password, role){
        console.log(first_name, last_name, email, age, password, role)
        return this.dao.createUser(first_name, last_name, email, age, password, role)
    }

    async compareUserData(username,password){
        return await this.dao.compareUserData(username,password)
    }

}

export const sessionService = new SessionService(DAO)