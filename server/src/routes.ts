import express from 'express';
import Knex from './database/connection';

const routes = express.Router();

routes.get('/items', async (request, response) => {
    const items = await Knex('items').select('*');

    const serializedItems = items.map(item => {
        return { // retornar o item no formato title, image_url
            title: item.title,
            image_url: `http://localhost:3333/uploads/${item.image}`,
        }
    });

    return response.json(serializedItems);
}); // pegar uma lista

export default routes;