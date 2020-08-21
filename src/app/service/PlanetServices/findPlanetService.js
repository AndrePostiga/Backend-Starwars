/* eslint-disable no-restricted-globals */
import { isValidObjectId } from 'mongoose';
import { BadRequestError } from '../../errors';
import PlanetRepository from '../../repository/planetRepository';
import FindMovieService from '../MovieServices/findMovieService';

class FindPlanetService {
  constructor() {
    this.repository = new PlanetRepository();
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

    const { docs, ...pagination } = await this.repository.findAll(pageNumber);
    const planetsWithMoviesCount = await Promise.all(
      docs.map((planet) => FindMovieService.getPlanetWithMoviesCount(planet))
    );

    return {
      ...pagination,
      planet: planetsWithMoviesCount,
    };
  }

  async find(searchKey) {
    let planet = null;

    if (isValidObjectId(searchKey)) {
      planet = await this.repository.findById(searchKey);
    }
    planet = await this.repository.findByName(searchKey);

    return FindMovieService.getPlanetWithMoviesCount(planet);
  }
}

export default new FindPlanetService();
