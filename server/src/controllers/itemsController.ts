import {Request, Response} from 'express';
import Knex from '../database/connection'; // conexão com o banco de dados
 
class itemsController {
    async index(request: Request, response: Response) {
        const items = await Knex('items').select('*'); //SELECT * FROM ITEMS;
    
        const serializedItems = items.map(item => {
            return { // retornar o item no formato title, image_url
                id: item.id,
                title: item.title,
                image_url: `http://localhost:3333/uploads/${item.image}`,
            };
        });

        return response.json(serializedItems);
    } 
};

export default itemsController;