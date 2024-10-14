import { Router } from 'express';
export const router=Router()
import path from "path";
import __dirname from "../utils.js";
import fs from "fs";
import { serverSockets } from '../server.js';

let ruta = path.join(__dirname,"archivos", "familia.json");

export function getUsers() {
    if (fs.existsSync(ruta)) {
        return JSON.parse(fs.readFileSync(ruta, "utf-8"));
    } else {
        return [];
    }
}

function saveUsers(users) {
    fs.writeFileSync(ruta, JSON.stringify(users, null, 5));
}

router.post('/',(req,res)=>{

    let {nombre, apellido} = req.body

    if(!nombre || !apellido){
        res.setHeader('Content-Type','application/json');
        return res.status(404).json({error: 'DEBES ENVIAR NOMBRE Y APELLIDO'});
    }
    
    let familia = getUsers()


    let id = 1;
    if (familia.length > 0) {
      id = familia[familia.length - 1].id + 1;
    }

    let newUser = {
        id,
        nombre,
        apellido
    }


    familia.push(newUser)

    saveUsers(familia)
    

    /* HACEMOS LA EMISION DEL NUEVO USUARIO */
    serverSockets.emit('newUser', {nombre})

    res.status(200).json({usuarioCreado: newUser})
})