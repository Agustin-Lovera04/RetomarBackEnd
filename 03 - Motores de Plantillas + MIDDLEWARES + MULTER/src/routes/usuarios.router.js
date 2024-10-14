import { Router } from 'express';
export const router=Router()

function mid1(req,res, next){
    console.log('Paso middle1')
    next()
}

let usuarios = []
router.post('/', mid1,(req,res)=>{

    let {nombre, email} = req.body

    usuarios.push({nombre, email})

    res.status(200).json({usuarios})
})

