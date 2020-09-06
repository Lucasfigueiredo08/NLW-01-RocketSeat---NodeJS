import express from 'express';
import Knex from './database/connection'; //conexão com o banco

const routes = express.Router();

routes.get('/items', async (request, response) => {
    const items = await Knex('items').select('*'); //SELECT * FROM ITEMS;

    const serializedItems = items.map(item => {
        return { // retornar o item no formato title, image_url
            id: item.id,
            title: item.title,
            image_url: `http://localhost:3333/uploads/${item.image}`,
        }
    });

    return response.json(serializedItems);
}); // pegar uma lista

routes.post('/points', async (request, response) => {
    const {
        name,
        email, 
        whatsapp,
        latitude,
        longitude,
        state, 
        uf,
        items
    } = request.body;

    const trx = await Knex.transaction();

    const inseredIds = await trx('points').insert({
        image: 'image-fake',
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        state,
        uf
    });

    const point_id = inseredIds[0];

    const pointItems = items.map((item_id: number) => { //tabela pivo relação entre point e items
        return {
            item_id,
            point_id,
        }
    })

    await trx('point_items').insert(pointItems);  // inserindo no banco 

    return response.json({ success: true });
});
export default routes;