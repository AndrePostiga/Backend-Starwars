/* eslint-disable no-restricted-globals */
import { isValidObjectId } from 'mongoose';
import PlanetRepository from '../../repository/planetRepository';
import { BadRequestError } from '../../errors';

class FindPlanetService {
  constructor() {
    this.repository = new PlanetRepository();
  }

  findAll(page) {
    const pageNumber = parseInt(page, 10);
    if (!Number.isInteger(pageNumber)) {
      throw new BadRequestError(`page is not a number`);
    }
    return this.repository.findAll(page);
  }

  find(searchKey) {
    if (isValidObjectId(searchKey)) {
      return this.repository.findById(searchKey);
    }
    return this.repository.findByName(searchKey);
  }
}

export default new FindPlanetService();
