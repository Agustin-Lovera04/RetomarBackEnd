import { Router } from 'express';
import { getUsers } from './familia.router.js';
export const router=Router()

router.get('/',(req,res)=>{

    res.status(200).render('home')
})

router.get('/familia', (req, res)=>{
    let familia = getUsers()

    res.status(200).render('familia', {familia})
})


router.get('/websocket', (req,res)=>{
    return res.status(200).render('websocket')
})