import { Router } from 'express';
import {fakerES as faker} from '@faker-js/faker'
export const router=Router()

function generaProducts () {
    let products = [];

    for (let i = 0; i < 100; i++) {
        let _id = faker.string.uuid();
        let code = faker.string.alphanumeric(5);
        let title = faker.commerce.productName();
        let description = faker.commerce.product();
        let price = faker.commerce.price({ min: 1000, max: 4000, dec: 2, symbol: '$' });
        let stock = faker.number.int({ min: 1, max: 20 });
        let category = faker.commerce.department();
        let __v = 0;
        let status = true;

        products.push({
            _id,
            code,
            title,
            description,
            price,
            stock,
            category,
            __v,
            status
        });
    }

    return products;
}


router.get('/',async (req,res)=>{
    let products = await generaProducts()
    return res.status(200).json({products})
})