// import FindPlanetService from '../service/PlanetServices/findPlanetService';
// import CreatePlanetService from '../service/PlanetServices/createPlanetService';
// import RemovePlanetService from '../service/PlanetServices/removePlanetService';

import {
  badRequest,
  created,
  notFound,
  httpSuccess,
  internalServerError,
  conflictError,
} from '../utils/http';
import {
  BadRequestError,
  NotFoundError,
  ServerError,
  ConflictError,
} from '../errors';

export default class PlanetController {
  constructor(findPlanetService, createPlanetService, removePlanetService) {
    this.findPlanetService = findPlanetService;
    this.createPlanetService = createPlanetService;
    this.removePlanetService = removePlanetService;
  }

  async index(req, res) {
    try {
      const { page = 1 } = req.query;
      const planets = await this.findPlanetService.findAll(page);
      const httpResponse = httpSuccess(planets);
      return res.status(httpResponse.statusCode).json(httpResponse);
    } catch (error) {
      let httpResponse = null;
      if (error instanceof BadRequestError) {
        httpResponse = badRequest(error);
      } else {
        httpResponse = internalServerError(new ServerError());
      }
      return res.status(httpResponse.statusCode).json(httpResponse);
    }
  }

  async indexBySearchTerm(req, res) {
    try {
      const { searchTerm } = req.params;
      const planet = await this.findPlanetService.find(searchTerm);
      const httpResponse = httpSuccess(planet);
      return res.status(httpResponse.statusCode).json(httpResponse);
    } catch (error) {
      let httpResponse = null;
      if (error instanceof BadRequestError) {
        httpResponse = badRequest(error);
      } else if (error instanceof NotFoundError) {
        httpResponse = notFound(error);
      } else {
        httpResponse = internalServerError(new ServerError());
      }

      return res.status(httpResponse.statusCode).json(httpResponse);
    }
  }

  async add(req, res) {
    try {
      const planet = await this.createPlanetService.create(req.body);
      const httpResponse = created(planet);
      return res.status(httpResponse.statusCode).json(httpResponse);
    } catch (error) {
      let httpResponse = null;
      if (error instanceof BadRequestError) {
        httpResponse = badRequest(error);
      } else if (error instanceof ConflictError) {
        httpResponse = conflictError(error);
      } else {
        httpResponse = internalServerError(new ServerError());
      }

      return res.status(httpResponse.statusCode).json(httpResponse);
    }
  }

  async remove(req, res) {
    try {
      const { searchTerm } = req.params;
      const planets = await this.removePlanetService.remove(searchTerm);
      const httpResponse = httpSuccess(planets);
      return res.status(httpResponse.statusCode).json(httpResponse);
    } catch (error) {
      let httpResponse = null;
      if (error instanceof BadRequestError) {
        httpResponse = badRequest(error);
      } else if (error instanceof NotFoundError) {
        httpResponse = notFound(error);
      } else {
        httpResponse = internalServerError(new ServerError());
      }

      return res.status(httpResponse.statusCode).json(httpResponse);
    }
  }
}
