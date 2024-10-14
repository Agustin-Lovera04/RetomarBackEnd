import express from 'express';
import __dirname from './utils.js';
import {engine} from 'express-handlebars'
import mongoose from 'mongoose'
import { router as viewsRouter} from './router/viewsRouter.js';
const PORT=3000;

const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(__dirname + '/public'))

app.engine('handlebars' , engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')



app.use('/' , viewsRouter)


const server=app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`);
});


try {
    await mongoose.connect('mongodb+srv://AgustinLovera:45507271Udmv@cluster0.govus.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {dbName: 'RetomarEccomerce'})
    console.log('Conexion Existosa con DB')
} catch (error) {
    console.log(error.message)
}
