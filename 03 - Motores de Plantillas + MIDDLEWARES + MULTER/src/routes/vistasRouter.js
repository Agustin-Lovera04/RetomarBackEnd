import { Router } from 'express';
export const router=Router()

//Creamos api fake para demostrar dinamismo de handlebars
let api = [
    {id: 1, nombre: "Natalia Balisardi"},
    {id: 2, nombre: "Sebastian Lovera"},
    {id: 3, nombre: "Juan Ignacio Lovera"}
]

router.get('/', (req, res) =>{

    //Pruebas de dinamismo, renderizar api en handlebars, enviada desde servidor
    let famliar01 = api[0]

    
    res.setHeader('Content-Type','text/html');
    return res.status(200).render('home', {famliar01});
})


router.get('/familiaCompleta',(req,res)=>{
    let familia = api
    let {detalle} = req.query
    res.status(200).render('familiaCompleta',{
        familia, detalle
    })
})