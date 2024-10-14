import { Router } from 'express';
import { usuariosModel } from '../models/usuarios.model.js';
import mongoose from 'mongoose';
export const router=Router()

router.get('/',async(req,res)=>{
    let usuarios = []
try {
    usuarios = await usuariosModel.find({deleted: false}) //filtra los no desactivados
} catch (error) {
    console.log(console.error)
}

    res.status(200).json({payload: usuarios})
})

router.get('/:id', async(req,res) =>{
    let {id} = req.params

    //VALIDAR QUE SE HAYA INGRESADO UN OBJECT ID VALIDO PARA DB
    if(!mongoose.Types.ObjectId.isValid(id)){
        res.setHeader('Content-Type','application/json');
        return res.status(404).json({error: 'Ingrese un id Valido'});
    }
    
    let existUser
    try {
        existUser= await usuariosModel.findOne({deleted: false, _id: id})
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({InternalError: error.message,});
    }

    if(!existUser){
        res.setHeader('Content-Type','application/json');
        return res.status(404).json({error: 'No existen usuarios con el id Ingresado'});
    }

    res.setHeader('Content-Type','application/json');
    return res.status(200).json({ok: existUser});
})


router.post('/',async (req,res) =>{
    let {nombre, apellido, email, edad} = req.body

    //Controlamos que hayan ingresado todos los datos
    if(!nombre || !apellido ||!email ||!edad){
        res.setHeader('Content-Type','application/json');
        return res.status(404).json({error: 'NO COLOCO LOS DATOS NECESARIOS: NOMBRE, APELLIDO, EMAIL, EDAD'});
    }


    //Controlamos que no exista un usuario con el mismo mail ya en DB

    let existUser

    try {
        existUser= await usuariosModel.findOne({deleted: false, email})
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({InternalError: error.message,});
    }

    if(existUser){
        res.setHeader('Content-Type','application/json');
        return res.status(404).json({error: 'el usuario con el email Ingresado ya existe en DB'});
    }


    //Metodo CREATE es el usado por mongoose para crear un dato en DB, como argumentos le enviamos los datos que usa el schema que establecimos

    try {
        let newUser = await usuariosModel.create ({nombre, apellido, email, edad})
        res.setHeader('Content-Type','application/json');
        return res.status(200).json({ok: newUser});
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({InternalError: error.message,});
    }
})




router.put('/:id', async(req,res) =>{
    let {id} = req.params

    //VALIDAR QUE SE HAYA INGRESADO UN OBJECT ID VALIDO PARA DB
    if(!mongoose.Types.ObjectId.isValid(id)){
        res.setHeader('Content-Type','application/json');
        return res.status(404).json({error: 'Ingrese un id Valido'});
    }
    
    let existUser
    try {
        existUser= await usuariosModel.findOne({deleted: false, _id: id})
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({InternalError: error.message,});
    }

    if(!existUser){
        res.setHeader('Content-Type','application/json');
        return res.status(404).json({error: 'No existen usuarios con el id Ingresado'});
    }

//NO PODEMOS DEJAR QUE SE PUEDA MODIFICAR EL ID DE LOS DATOS EN DB
    if(req.body._id || req.body.email){
        res.setHeader('Content-Type','application/json');
        return res.status(404).json({error: 'NO SE PERMITE MODIFICAR EL ID O EL EMAIL'});
    }


    //MODIFICAMOS EL DATO CON EL METODO UPDATE, EN ESTE CASO SINGULAR UPDATEONE
    let userPut

    try {
        userPut = await usuariosModel.updateOne({deleted:false, _id: id}, req.body) // Filtro y luego propiedades a modificar ( lo que llega en el body en este caso)
        

        //ModifiedCount es la propiedad que devuelve update si se concreta la modificacion, si es 0 no modifico nada, si es mayor, ya modifico algun dato, por lo tanto abajo hacemos una validacion mas.
        if(userPut.modifiedCount === 0){
            res.setHeader('Content-Type','application/json');
            return res.status(404).json({error: 'NO SE CONCRETO LA MODIFICACION'});
        }
        
        res.setHeader('Content-Type','application/json');
        return res.status(200).json({ok: userPut});
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({InternalError: error.message});
    }
})




router.delete('/:id', async(req,res)=>{
    let {id} = req.params

    //VALIDAR QUE SE HAYA INGRESADO UN OBJECT ID VALIDO PARA DB
    if(!mongoose.Types.ObjectId.isValid(id)){
        res.setHeader('Content-Type','application/json');
        return res.status(404).json({error: 'Ingrese un id Valido'});
    }
    
    let existUser
    try {
        existUser= await usuariosModel.findOne({deleted: false, _id: id})
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({InternalError: error.message,});
    }

    if(!existUser){
        res.setHeader('Content-Type','application/json');
        return res.status(404).json({error: 'No existen usuarios con el id Ingresado'});
    }



    //COMO ESTAMOS USANDO UNA "ELIMINACION LOGICA" NO VAMOS A ELIMINAR FISICAMENTE A EL DATO, SINO QUE CAMBIAREMOS SU ESTADO A UN DESACTIVADO, AL FIN Y AL CABO ES UN UPDATE
    let userDeleted
    try {
        userDeleted = await usuariosModel.updateOne({deleted:false, _id: id}, {deleted: true}) // Filtro y luego propiedades a modificar ( lo que llega en el body en este caso)
        

        //ModifiedCount es la propiedad que devuelve update si se concreta la modificacion, si es 0 no modifico nada, si es mayor, ya modifico algun dato, por lo tanto abajo hacemos una validacion mas.
        if(userDeleted.modifiedCount === 0){
            res.setHeader('Content-Type','application/json');
            return res.status(404).json({error: 'NO SE CONCRETO LA MODIFICACION'});
        }
        
        res.setHeader('Content-Type','application/json');
        return res.status(200).json({ok: userDeleted});


        //SI quisieramos borrar fisicamente el dato deberiamos hacer:
        //userDeleted = await usuariosMode.deleteOnde({_id:id})
       /*  if(userDeleted.deletedCount === 0){
         res.setHeader('Content-Type','application/json');
            return res.status(404).json({error: 'NO SE CONCRETO LA ELIMINACION'});
        }
        
        res.setHeader('Content-Type','application/json');
        return res.status(200).json({ok: userDeleted}); */



    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({InternalError: error.message});
    }

})