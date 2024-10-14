import express from 'express'
import __dirname from './utils.js'
import { router as vistasRouter } from './routes/vistasRouter.js'
import {engine} from 'express-handlebars'
import {Server} from 'socket.io'
import { router as familiaRouter} from './routes/familia.router.js'

const PORT = 3000

const app = express()


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + '/public'))

app.engine('handlebars' , engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')

app.use('/api/familia', familiaRouter)
app.use('/', vistasRouter)

const serverHTTP = app.listen(PORT, () => {
    console.log(`Server Online ${PORT}`)
})


export const serverSockets = new Server(serverHTTP)

/* PONER A ESCUCHAR EL SERVERSOCKET EN ESTE CASO QUE ESTE ATENTO A LA CONEXION */
serverSockets.on("connection", socket =>{
    console.log(`se conecto un cliente con id ${socket.id}`)// en "socket, esta toda la informacion del cliente, por eso podemos acceder a .id"
    
    
    socket.emit('saludo', {emisor: 'Server', mensaje: `¡BIENVENIDO, SE LE ASIGNO EL ID: ${socket.id}` })

    socket.on('nombre', (datos) =>{
        console.log(`El cliente con id: ${socket.id}, se Identifico como ${datos.nombre}`)
        
        socket.broadcast.emit('newUser', {emisor: 'Servidor', mensaje: `${datos.nombre} Se ha Unido al Servidor`})
    





        /* TRABAJAMOS CON CRUD, ACTUALIZACION DE CONSUMO DE API AL INSTANTE CON WEBASOCKET */


    })


})