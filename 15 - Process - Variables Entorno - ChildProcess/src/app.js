import express from 'express';
import __dirname from './utils.js';
import {engine} from 'express-handlebars'
import mongoose from 'mongoose'
import { router as viewsRouter} from './router/views.router.js';
import { router as productsRouter } from './router/products.router.js';
import { router as cartsRouter } from './router/carts.router.js';
import { router as chatRouter } from './router/chat.router.js';
import { router as sessionsRouter } from './router/sessions.router.js';
import {Server} from 'socket.io'
import mongoStore from 'connect-mongo'
import multer from 'multer';
import { ChatManager } from './dao/manager/chat.manager.js';
import { initPassport } from './config/config.passport.js';
import cookieParser from 'cookie-parser'
import passport from 'passport';
import { config } from './config/config.js';

const PORT=config.PORT

const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(`${__dirname}/public`));


app.engine('handlebars', engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
}))

/* app.use(session({
    store: mongoStore.create({
        mongoUrl: 'mongodb+srv://AgustinLovera:45507271Udmv@cluster0.govus.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
        mongoOptions: {dbName: 'RetomarEccomerce'},
        ttl: 60 * 30 // media hora
    }),
    secret: "UDMV",
    resave: true, // guarda igual la info, auqneu haya inactividad,
    saveUnitialized: false // guardar igual aunque no hayan ingresado datos, Lo desactivo ya que apenas el servidor detecta una solicitud entrante crea una session y eso genera mucho residuo en BD
})) */

app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')


//CONFIGURACION DE PASSPORT
initPassport()
app.use(passport.initialize())


//CONFIGURACION COOKIES
export const sign = config.SIGN_COOKIE
app.use(cookieParser(sign))

app.use('/api/chat' , chatRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/products' , productsRouter)
app.use('/api/sessions' , sessionsRouter)
app.use('/' , viewsRouter)





const server=app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`);
});


//VER COMO ELIMINAR TODA ESTA LOGICA DEL APP
export const chatManager = new ChatManager()


export const io = new Server(server)
io.on("connection", (socket) => {
    console.log(`Se conecto un cliente, id: ${socket.id}`)


    socket.on('correo', correo => {
        socket.broadcast.emit('newUser', (correo))
    })

    socket.on('message', async (datos) => {
        let saveDatos = await chatManager.saveDatos(datos)
        io.emit("newMessage", saveDatos);
    })

})



try {
    // await mongoose.connect('mongodb+srv://AgustinLovera:45507271Udmv@cluster0.govus.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {dbName: 'RetomarEccomerce'})
    await mongoose.connect(config.MONGO_URL, {dbName: config.DBNAME})
    console.log('Conexion Existosa con DB')
} catch (error) {
    console.log(error.message)
}
