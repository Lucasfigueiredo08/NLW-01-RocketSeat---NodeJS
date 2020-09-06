import express from 'express';

import pointsController from './controllers/pointsController';
import itemsController from './controllers/itemsController';

const routes = express.Router();

//Controllers
const PointsController = new pointsController();
const ItemsController = new itemsController();

//rotas
routes.get('/items', ItemsController.index); // pegar uma lista

routes.post('/points', PointsController.create);
routes.get('/points', PointsController.index);
routes.get('/points/:id', PointsController.show); //request params, listar por id os pontos

export default routes;