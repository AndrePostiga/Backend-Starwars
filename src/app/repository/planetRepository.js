import { isValidObjectId } from 'mongoose';
import { NotFoundError, BadRequestError, ServerError } from '../errors';

export class PlanetRepository {
  constructor(planetModel) {
    this.planetModel = planetModel;
  }

  async findAll(page) {
    const planets = await this.planetModel.paginate({}, { page, limit: 10 });

    if (!planets) {
      throw new ServerError();
    }

    return planets;
  }

  async findByName(name) {
    const planet = await this.planetModel.findOne({ name });

    if (!planet) {
      throw new NotFoundError(name);
    }

    return planet;
  }

  async findById(id) {
    if (!isValidObjectId(id)) {
      throw new BadRequestError('id is not an valid objectId');
    }

    const planet = await this.planetModel.findById(id);

    if (!planet) {
      throw new NotFoundError(id);
    }
    return planet;
  }

  async create({ name, climate, terrain }) {
    const planet = await this.planetModel.create({
      name,
      climate,
      terrain,
    });

    if (!planet) {
      throw new ServerError();
    }

    return planet;
  }

  async removeById(id) {
    const planet = await this.findById(id);
    const deleteInformation = await this.planetModel.deleteOne({ _id: id });

    if (!deleteInformation) {
      throw new ServerError();
    }

    return planet;
  }

  async removeByName(name) {
    const planet = await this.findByName(name);
    const deleteInformation = await this.planetModel.deleteOne({ name });

    if (!deleteInformation) {
      throw new ServerError();
    }

    return planet;
  }
}
