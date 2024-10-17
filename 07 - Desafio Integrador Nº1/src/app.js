import express from 'express';
import __dirname from './utils.js';
import {engine} from 'express-handlebars'
import mongoose from 'mongoose'
import { router as viewsRouter} from './router/views.router.js';
import { router as productsRouter } from './router/products.router.js';
import {Server} from 'socket.io'
const PORT=3000;

const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(__dirname + '/public'))

app.engine('handlebars', engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
}))
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')


app.use('/api/products' , productsRouter)
app.use('/' , viewsRouter)


const server=app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`);
});




export const io = new Server(server)
io.on("connection", (socket) => {
    console.log(`Se conecto un cliente, id: ${socket.id}`)
})



try {
    await mongoose.connect('mongodb+srv://AgustinLovera:45507271Udmv@cluster0.govus.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {dbName: 'RetomarEccomerce'})
    console.log('Conexion Existosa con DB')
} catch (error) {
    console.log(error.message)
}
