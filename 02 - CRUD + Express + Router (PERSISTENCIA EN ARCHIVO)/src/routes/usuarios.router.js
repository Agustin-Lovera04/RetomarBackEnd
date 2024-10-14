import { Router } from "express";
import path from "path";
import __dirname from "../utils.js";
import fs from "fs";

let ruta = path.join(__dirname,"archivos", "usuarios.json");

function getUsers() {
    if (fs.existsSync(ruta)) {
        return JSON.parse(fs.readFileSync(ruta, "utf-8"));
    } else {
        return [];
    }
}

function saveUsers(users) {
    fs.writeFileSync(ruta, JSON.stringify(users, null, 5));
}

/* exportamos Router */
export const router = Router();


/* LECTURA DE USUARIOS */
router.get('/', (req,res)=>{
    let usuarios = getUsers()

    res.setHeader('Content-Type','application/json');
    return res.status(200).json({usuarios});
})

router.get("/:id", (req, res) => {
  let { id } = req.params;

  id = parseInt(id);

  if (isNaN(id)) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: "ESCRIBA UN ID NUMERICO" });
  }

  let usuarios = getUsers();
  let findUser = usuarios.find((u) => u.id === id);

  if (!findUser) {
    res.setHeader("Content-Type", "application/json");
    return res.status(404).json({ error: "No existe un usuario con ese ID" });
  }

  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({ Usuario: findUser });
});

/* POST PARA GUARDAR USUARIO */
router.post("", (req, res) => {
  let { nombre, apellido } = req.body;

  if (!nombre || !apellido) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({ error: "Nombre y Apellido son obligatorios" });
  }

  /* Mas validaciones de datos ej ExReg */
  let exReg = /[0-9]/;
  if (exReg.test(nombre) || exReg.test(apellido)) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({ error: "No estan permitidos numeros en nombre o apellido" });
  }

  /* Valida existencia en BD */
  let usuarios = getUsers();
  let existUser = usuarios.find(
    (u) => u.nombre === nombre && u.apellido === apellido
  );
  if (existUser) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({
        error: `El usuario con nombre ${nombre} ${apellido}, ya existe en BD`,
      });
  }

  /* Manera de trabajar con id */
  let id = 1;
  if (usuarios.length > 0) {
    id = usuarios[usuarios.length - 1].id + 1;
  }

  let newUser = {
    id,
    nombre,
    apellido,
  };

  usuarios.push(newUser);

  saveUsers(usuarios);

  res.setHeader("Content-Type", "application/json");
  res.status(201).json({
    newUser,
  });
});
router.put("/:id", (req, res) => {
  let { id } = req.params;

  id = Number(id);

  if (isNaN(id)) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: "INGRESE UN ID NUMERICO" });
  }

  /* Buscamos el usuario a modificar mediante su index */
  let usuarios = getUsers();
  let indexUser = usuarios.findIndex((u) => u.id === id);
  if (indexUser === -1) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(404)
      .json({ error: "NO EXISTEN USUARIOS CON EL ID INGRESADO" });
  }

  /* validamos propiedades que permitidas */

  let propPermitidas = ["nombre", "apellido", "edad"];

  let propIngresadas = Object.keys(req.body); //object.keys, devuelve solo las claves del array de obj que llega

  let valida = propIngresadas.every((prop) => propPermitidas.includes(prop)); //every, recorre todos los obj del array y ejecuta un callback por cada elemento, solo deja pasar si es correcta la validacion

  if (!valida) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(400)
      .json({
        error: `INGRESASTE PROPIEDADES NO PERMITIDAS.PERMITIDO: ${propPermitidas}`,
      });
  }

  /* metodo spread y ponemos en el usuerModified, todas las propiedades y luego igualamos los usuarios */
  let userModified = {
    ...usuarios[indexUser],
    ...req.body,
    id,
  };

  usuarios[indexUser] = userModified;
  saveUsers(usuarios);

  res.setHeader("Content-Type", "application/json");
  res.status(200).json({
    userModified,
  });
});

router.delete("/:id", (req, res) => {
  let { id } = req.params;

  id = Number(id);

  if (isNaN(id)) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: "INGRESE UN ID NUMERICO" });
  }

  /* Buscamos el usuario a modificar mediante su index */
  let usuarios = getUsers();
  let indexUser = usuarios.findIndex((u) => u.id === id);
  if (indexUser === -1) {
    res.setHeader("Content-Type", "application/json");
    return res
      .status(404)
      .json({ error: "NO EXISTEN USUARIOS CON EL ID INGRESADO" });
  }

  let userDelete = usuarios.splice(indexUser, 1); //Borra el elemento indicado por parametro, devuelve el elemento eliminado
  saveUsers(usuarios);

  res.setHeader("Content-Type", "application/json");
  res.status(200).json({
    userDelete,
  });
});
