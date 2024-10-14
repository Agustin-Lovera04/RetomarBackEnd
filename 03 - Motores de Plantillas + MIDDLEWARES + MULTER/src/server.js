import express from 'express'
import __dirname from './utils.js'
import { router as usuariosRouter } from './routes/usuarios.router.js'
import { router as vistasRouter } from './routes/vistasRouter.js'
import fs from 'fs'
import {engine} from 'express-handlebars'

/* importamos upload */
import { upload } from './utils.js'
const PORT = 3000

const app = express()


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + '/public'))

//Handlebars configuracion
app.engine('handlebars', engine())//declara y inicializa el motor
app.set('view engine', 'handlebars')//setea el motor de vistas
app.set('views', './src/views')//donde se encontraran las vistas


//router
app.use('/api/usuarios', usuariosRouter)
app.use('/', vistasRouter)



const server=app.listen(PORT, () => {
    console.log(`Server Online ${PORT}`)
})


/* app.post('/multer', upload.single('avatar'),(req, res, next)=>{

    //EL FORMULARIO ESTA ABAJOOOOOO INDEX.HTML



    //Validar que el tipo de dato, sea permitido
    //mimetype ( dato del file)
    //subString ( separa por caracteres en los parametros que digamos 0, 5 porque "image" son 5 letras)

    if(req.file.mimetype.substring(0,5).toLocaleLowerCase()!=='image'){
        //unlinkSync metodo de eliminacion de FS
        fs.unlinkSync(req.file.path)
        res.setHeader('Content-Type','application/json');
        return res.status(401).json({error: 'Solo se admiten imagenes'});
    }
    
      res.status(200).json({status: "ok"})
  })



  <form action="/api/usuarios" method="post">
    <input type="text" name="nombre" placeholder="nombre">
    <input type="email" name="email" placeholder="email">

    <input type="submit" value="Agregar">
</form>


<h2>Subir archivos con Multer:</h2>

<form action="/multer" method="post" enctype="multipart/form-data">
    <input type="file" name="avatar" />
    <input type="text" name="nombre" placeholder="nombre">
    <input type="submit" value="Upload">
</form> */