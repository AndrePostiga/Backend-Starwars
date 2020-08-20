import { isValidObjectId } from 'mongoose';
import PlanetModel from '../model/planetModel';
import { NotFoundError, BadRequestError } from '../errors';

class PlanetRepository {
  constructor() {
    this.model = PlanetModel;
  }

  async findAll(page) {
    const planets = await this.model.paginate({}, { page, limit: 10 });
    return planets;
  }

  async findByName(name) {
    const planet = await this.model.findOne({ name });

    if (!planet) {
      throw new NotFoundError(name);
    }

    return planet;
  }

  async findById(id) {
    if (!isValidObjectId(id)) {
      throw new BadRequestError('id is not an valid objectId');
    }

    const planet = await this.model.findById(id);

    if (!planet) {
      throw new NotFoundError(id);
    }
    return planet;
  }

  async create({ name, climate, terrain }) {
    const planet = await this.model.create({
      name,
      climate,
      terrain,
    });

    return planet;
  }

  async removeById(id) {
    if (!isValidObjectId(id)) {
      throw new BadRequestError('id is not an valid objectId');
    }

    const planet = this.model.findByIdAndRemove(id);

    if (!planet) {
      throw new NotFoundError(id);
    }
    return planet;
  }

  async removeByName(name) {
    const planet = await this.model.findOneAndRemove({ name });

    if (!planet) {
      throw new NotFoundError(name);
    }

    return planet;
  }
}

export default PlanetRepository;
