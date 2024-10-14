import express from 'express';
import mongoose from 'mongoose'
import { router as usuariosRouter} from './routes/usuarios.router.js';
const PORT=3000;

const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api/usuarios' , usuariosRouter)

app.get('/',(req,res)=>{
    res.setHeader('Content-Type','text/plain');
    res.status(200).send('OK');
})

const server=app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`);
});


/* CONEXION A BD */

try {
    await mongoose.connect('mongodb+srv://AgustinLovera:45507271Udmv@cluster0.govus.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {dbName: 'TestBackEnd'})
    console.log('Conexion Existosa con DB')
} catch (error) {
    console.log(error.message)
}
