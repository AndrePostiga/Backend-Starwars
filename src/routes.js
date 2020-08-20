import { Router } from 'express';
import PlanetController from './app/controllers/planetController';

const routes = new Router();

routes.get('/', (req, res) => {
  return res.json({ hello: 'Hello World' });
});

routes.get('/api/v1/planets', PlanetController.index);
routes.get('/api/v1/planets/:searchTerm', PlanetController.indexBySearchTerm);
routes.post('/api/v1/planets', PlanetController.add);
routes.delete('/api/v1/planets/:searchTerm', PlanetController.remove);

export default routes;
