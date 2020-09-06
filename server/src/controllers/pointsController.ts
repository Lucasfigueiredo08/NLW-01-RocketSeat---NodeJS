import { Request, Response } from 'express';  // importando quando ts reclama.
import Knex from '../database/connection'; //conexão com o banco de dados

class pointsController {
    async index(request: Request, response: Response) {
        // state, uf, items (Query Params)

        const { state, uf, items } = request.query;

        //console.log(state, uf, items );
                              
        const parsedItems = String(items) //forçar a variável ser string
            .split(',') //separar em vírgulas
            .map(item =>  Number(item.trim())) //Remover os espaços e transformar em número

        
        const points = await Knex('points')
            .join('point_items', 'point_id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('state', String(state))
            .where('uf', String(uf))
            .distinct()
            .select('points.*'); //pega todos os resultados da tabela points

        return response.json(points);
             
    }

    async show(request: Request, response: Response) {
        const { id } = request.params; //desestruturação com request params

        const point = await await Knex('points').where('id', id).first(); // Select * from POINT where point.id = id; first = coletar o primeiro
        
        if(!point) {
            return response.status(400).json({ message: 'Point not found' }); // 400 código/messagem de erro
        }

        /**
         * SELECT * FROM items
         * JOIN point_items ON items.id = point_items.item_id
         * WHERE point_items.point_id = {id}
         */
        
        const items = await Knex('items') // query para selecionar itens
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title'); // para para selecionar apenas uma informação no caso o título
        
        return response.json({ point, items });
    }

    async create(request: Request, response: Response) {
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

        const point = { //um objeto com todas as informações do ponto
            image: 'https://images.unsplash.com/photo-1556767576-5ec41e3239ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            state,
            uf
        };
    
        const inseredIds = await trx('points').insert(point);
    
        const point_id = inseredIds[0];
    
        const pointItems = items.map((item_id: number) => { //tabela pivo relação entre point e items
            return {
                item_id,
                point_id,
            }
        })
    
        await trx('point_items').insert(pointItems);  // inserindo no banco 
    
        await trx.commit(); // é necessário em todos os lugares
                            // que foi utilizada as transactions

        return response.json({ //retornando os dados da criação do point
            id: point_id,
            ...point,
         });
    }
}

export default pointsController;