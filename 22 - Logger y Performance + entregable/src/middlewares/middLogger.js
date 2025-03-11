import { logger } from "../utils/winston.js"
export const middLogger = (req,res,next) => {
    req.logger = logger

    next()
}