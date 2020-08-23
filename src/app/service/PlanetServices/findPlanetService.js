/* eslint-disable no-restricted-globals */
import { isValidObjectId } from 'mongoose';
import { BadRequestError } from '../../errors';

export class FindPlanetService {
  constructor(planetRepository, findMovieService) {
    this.planetRepository = planetRepository;
    this.findMovieService = findMovieService;
  }

  isValidPageNumber(page) {
    const pageNumber = parseInt(page, 10);
    if (!Number.isInteger(page) && isNaN(pageNumber)) {
      throw new BadRequestError(`page is not a number`);
    }

    return pageNumber;
  }

  async findAll(page) {
    const pageNumber = this.isValidPageNumber(page);

    const { docs, ...pagination } = await this.planetRepository.findAll(
      pageNumber
    );

    const planetsWithMoviesCount = await Promise.all(
      docs.map((planet) =>
        this.findMovieService.getPlanetWithMoviesCount(planet)
      )
    );

    return {
      ...pagination,
      planet: planetsWithMoviesCount,
    };
  }

  async find(searchKey) {
    let planet = null;

    if (isValidObjectId(searchKey)) {
      planet = await this.planetRepository.findById(searchKey);
    } else {
      planet = await this.planetRepository.findByName(searchKey);
    }

    return this.findMovieService.getPlanetWithMoviesCount(planet);
  }
}
