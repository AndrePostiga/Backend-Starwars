import { Router } from 'express';
import axios from 'axios';
import NodeCache from 'node-cache';
import PlanetController from './app/controllers/planetController';
import {
  FindPlanetService,
  CreatePlanetService,
  RemovePlanetService,
} from './app/service/PlanetServices';
import { FindMovieService } from './app/service/MovieServices';
import { PlanetRepository, MoviesRepository } from './app/repository';
import PlanetModel from './app/model/planetModel';

// Cache api instance
const cacheApi = new NodeCache({ stdTTL: process.env.ONE_MONTH });

// External Resource Instance
const swapiPlanetResource = axios.create({
  baseURL: 'https://swapi.dev/api/planets',
});

// Repository Instances
const planetRepository = new PlanetRepository(PlanetModel);
const moviesRepository = new MoviesRepository(swapiPlanetResource, cacheApi);

// Services Instances
const findMovieService = new FindMovieService(moviesRepository);
const findPlanetService = new FindPlanetService(
  planetRepository,
  findMovieService
);
const createPlanetService = new CreatePlanetService(planetRepository);
const removePlanetService = new RemovePlanetService(planetRepository);

const planetController = new PlanetController(
  findPlanetService,
  createPlanetService,
  removePlanetService
);

const routes = new Router();

routes.get('/', async (req, res) => {
  return res.json({ ok: 'Rodando =D' });
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
