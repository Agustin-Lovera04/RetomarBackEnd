import express from 'express'
import  {router as userRouter } from './routes/usuarios.router.js'

const PORT = 3000

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
 
const server=app.listen(PORT, () => {
    console.log(`Server Online ${PORT}`)
})


/* CONFIGURAMOS EL USO DE ROUTER */
app.use('/api/usuarios', userRouter)


app.get('/', (req, res) =>{
    res.setHeader('Content-Type','text/plain');
    return res.status(200).send('OK');
})
