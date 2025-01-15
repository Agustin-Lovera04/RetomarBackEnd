import dotenv from 'dotenv'
import __dirname from '../utils.js'

dotenv.config(
    {
        override: true,
        path:`${__dirname}/.env`
    }
)


export const config = {
    PORT: process.env.PORT || 8080,
    MONGO_URL: process.env.MONGO_URL,
    DBNAME: process.env.DBNAME,
    SIGN_COOKIE: process.env.SIGN_COOKIE,
    SECRET_KEY_TOKEN: process.env.SECRET_KEY_TOKEN
}