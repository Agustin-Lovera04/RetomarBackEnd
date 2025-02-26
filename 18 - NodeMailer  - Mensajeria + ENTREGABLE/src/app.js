import express from 'express';
import __dirname from './utils.js';
import {engine} from 'express-handlebars'
import mongoose from 'mongoose'
import { router as viewsRouter} from './router/views.router.js';
import { router as productsRouter } from './router/products.router.js';
import { router as cartsRouter } from './router/carts.router.js';
import { router as chatRouter } from './router/chat.router.js';
import { router as sessionsRouter } from './router/sessions.router.js';
import { router as purchaseRouter } from './router/purchase.router.js';
import {Server} from 'socket.io';
import {chatService} from './services/chat.Service.js'
import { initPassport } from './config/config.passport.js';
import cookieParser from 'cookie-parser'
import passport from 'passport';
import { config } from './config/config.js';
/* import './helpers-handlebars/helpers.js' */

const PORT= config.PORT
export const SECRETKEY = config.SECRET_KEY_TOKEN

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
app.use('/api/purchase', purchaseRouter)
app.use('/' , viewsRouter)





const server=app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`);
});





export const io = new Server(server)
io.on("connection", (socket) => {
    console.log(`Se conecto un cliente, id: ${socket.id}`)


    socket.on('correo', correo => {
        socket.broadcast.emit('newUser', (correo))
    })

    socket.on('message', async (datos) => {
        let saveDatos = await chatService.saveDatos(datos)
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
