import express from 'express'

const PORT = 3000

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
 
const server=app.listen(PORT, () => {
    console.log(`Server Online ${PORT}`)
})

/* API DE URGENCIA */
const api = [
    {id: 1, Madre: "Natalia Balisardi"},
    {id: 2, Padre: "Sebastian Lovera"},
    {id: 3, Hermano: "Juan Ignacio Lovera"}
]


app.get('/', (req,res)=>{
    res.send('Server Online')
})

app.get('/datos', (req,res)=>{
    let mensaje= "BIENVENIDO: "

    if(req.query.nombre){
        mensaje += req.query.nombre
    }
    res.send(`<h1 style="color:blue">${mensaje}</h1>`)
})

app.get('/api', (req,res)=>{
    let resultado = api
    if(req.query.limit){
        resultado= resultado.slice(0, req.query.limit)
    }

    res.setHeader("Content-Type", "application/json")
    res.json({Filtro: req.query ,Familia: resultado})
})

app.get('/api/:id', (req,res)=>{
    let {id} = req.params

    id= Number(id)

    if(isNaN(id)){
        res.send("ID NO NUMERICO")
    }

    let resultado = api.find(p => p.id === id)

    if(!resultado){
        res.send("Persona Inexistente")
    }

    res.setHeader("Content-Type", "application/json")
    res.json({Personaje: resultado})
})