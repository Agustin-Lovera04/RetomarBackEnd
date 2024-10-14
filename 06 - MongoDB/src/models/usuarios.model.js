import mongoose from "mongoose";

const usuariosColection = 'usuarios'

const usuariosSchema = new mongoose.Schema(
    {
        nombre: String,
        apellido: String,
        email: {
            type: String, unique: true, required: true //validaciones extras en propiedades que querramos ej Unique:true
        },
        edad: Number,
        deleted: {
            type: Boolean, default: false //Esto lo hacemos por un tema de "eliminacion logica", para no eliminar del registro completamente a un usuario por ej, si no que se "desactiva", para que luego no influya en el flujo de las operaciones del servidor, pero sin perder la informacion del usuario
        }
    },
    {
        timestamps:true, //Segundo argumento del Schema, apto para propiedades mas generales, como TimeStamps que guarda la informacion de hora de la modificacion etc
        strict: true
    }
)

// Aca exportamos el modelo, y le enviamos como argumento la coleccion y el shcema a utilizar
export const usuariosModel = mongoose.model(usuariosColection, usuariosSchema) 