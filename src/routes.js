import { Router } from 'express';
import PlanetController from './app/controllers/planetController';
import {
  FindPlanetService,
  CreatePlanetService,
  RemovePlanetService,
} from './app/service/PlanetServices';

const planetController = new PlanetController(
  new FindPlanetService(),
  new CreatePlanetService(),
  new RemovePlanetService()
);

const routes = new Router();

routes.get('/', (req, res) => {
  return res.json({ hello: 'Hello World' });
});

routes.get('/api/v1/planets', (req, res) => planetController.index(req, res));

routes.get('/api/v1/planets/:searchTerm', (req, res) =>
  planetController.indexBySearchTerm(req, res)
);

routes.post('/api/v1/planets', (req, res) => planetController.add(req, res));

routes.delete('/api/v1/planets/:searchTerm', (req, res) =>
  planetController.remove(req, res)
);

export default routes;
