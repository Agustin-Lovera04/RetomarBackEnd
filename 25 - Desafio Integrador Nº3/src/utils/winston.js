import winston from 'winston'
import __dirname from '../utils.js';
import { config } from '../config/config.js'

const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    }
  };


export const logger = winston.createLogger(
    {
        levels: customLevelsOptions.levels,
        transports:[]
}
)




const transportDevelopment = new winston.transports.Console(
    {
        level: "debug",
        format: winston.format.combine(
            winston.format.colorize({
                colors: {
                  fatal: "red",
                  error: "magenta",
                  warning: "yellow",
                  info: "green",
                  http: "cyan",
                  debug: "blue",
                }}),
            winston.format.simple()
        )
    }
)

const transportProductionCONSOLE = new winston.transports.Console(
        {
            level: "info",
            format: winston.format.combine(
                winston.format.colorize({
                    colors: {
                    fatal: "red",
                    error: "magenta",
                    warning: "yellow",
                    info: "green",
                    http: "cyan",
                    debug: "blue",
                    }}),
                winston.format.simple()
            )
        }
    )


    const transrportProductionFILE = new winston.transports.File({
        level: "error",
        filename: `${__dirname}/logs/errors.log`,
        format: winston.format.simple()  
    })




if(config.MODE === "development"){
    logger.add(transportDevelopment)
}

if(config.MODE === "production"){
    logger.add(transportProductionCONSOLE)
    logger.add(transrportProductionFILE)
}